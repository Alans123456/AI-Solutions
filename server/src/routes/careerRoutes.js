import express from "express";
import { v4 as uuid } from "uuid";
import { all, get, run } from "../db/sqlite.js";

export const careerRoutes = express.Router();
export const adminCareerRoutes = express.Router();

function parseApplication(row) {
  return JSON.parse(row.data);
}

careerRoutes.post("/careers/:id/apply", async (req, res, next) => {
  try {
    const { name, email, phone, coverLetter, cvName, cvType, cvData } = req.body || {};

    if (!name || !email || !cvName || !cvData) {
      return res.status(400).json({ message: "Name, email, and CV are required." });
    }

    if (String(cvData).length > 3500000) {
      return res.status(413).json({ message: "CV file is too large. Please upload a file under 2.5MB." });
    }

    const career = await get("SELECT data FROM content_items WHERE type = ? AND id = ?", ["careers", req.params.id]);
    const id = uuid();
    const now = new Date().toISOString();
    const application = {
      _id: id,
      careerId: req.params.id,
      careerTitle: career ? JSON.parse(career.data).title : "Career Application",
      name,
      email,
      phone: phone || "",
      coverLetter: coverLetter || "",
      cvName,
      cvType: cvType || "application/octet-stream",
      cvData,
      status: "New",
      submittedAt: now,
      notes: []
    };

    await run("INSERT INTO career_applications (id, career_id, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", [
      id,
      req.params.id,
      JSON.stringify(application),
      now,
      now
    ]);

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully. We will review your CV and contact you if there is a fit.",
      confirmationNumber: `APP-${id.slice(0, 8).toUpperCase()}`
    });
  } catch (error) {
    return next(error);
  }
});

adminCareerRoutes.get("/career-applications", async (_req, res, next) => {
  try {
    const rows = await all("SELECT data FROM career_applications ORDER BY datetime(created_at) DESC");
    return res.json({ applications: rows.map(parseApplication) });
  } catch (error) {
    return next(error);
  }
});

adminCareerRoutes.put("/career-applications/:id", async (req, res, next) => {
  try {
    const row = await get("SELECT data FROM career_applications WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ message: "Application not found." });

    const existing = JSON.parse(row.data);
    const notes = req.body.notes ? [...(existing.notes || []), req.body.notes] : existing.notes || [];
    const updated = {
      ...existing,
      ...req.body,
      notes,
      _id: req.params.id
    };

    await run("UPDATE career_applications SET data = ?, updated_at = ? WHERE id = ?", [
      JSON.stringify(updated),
      new Date().toISOString(),
      req.params.id
    ]);

    return res.json({ success: true, message: "Application updated successfully.", application: updated });
  } catch (error) {
    return next(error);
  }
});
