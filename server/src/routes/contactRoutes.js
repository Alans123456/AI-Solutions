import express from "express";
import { v4 as uuid } from "uuid";
import { all, get, run } from "../db/sqlite.js";
import { authRequired } from "../middleware/authRequired.js";

export const contactRoutes = express.Router();
export const adminInquiryRoutes = express.Router();

function parseInquiry(row) {
  return JSON.parse(row.data);
}

contactRoutes.post("/contact", async (req, res, next) => {
  try {
    const { name, email, jobDetails } = req.body;
    if (!name || !email || !jobDetails) {
      return res.status(400).json({ message: "Name, email, and job details are required." });
    }

    const id = uuid();
    const now = new Date().toISOString();
    const inquiry = {
      _id: id,
      ...req.body,
      status: "New",
      priority: "Medium",
      submittedAt: now,
      notes: []
    };

    await run("INSERT INTO inquiries (id, data, created_at, updated_at) VALUES (?, ?, ?, ?)", [
      id,
      JSON.stringify(inquiry),
      now,
      now
    ]);

    return res.status(201).json({
      success: true,
      message: "Thank you for your inquiry. We will get back to you soon.",
      confirmationNumber: `INQ-${id.slice(0, 8).toUpperCase()}`
    });
  } catch (error) {
    return next(error);
  }
});

adminInquiryRoutes.get("/inquiries", authRequired, async (_req, res, next) => {
  try {
    const rows = await all("SELECT data FROM inquiries ORDER BY datetime(created_at) DESC");
    const inquiries = rows.map(parseInquiry);
    return res.json({ inquiries });
  } catch (error) {
    return next(error);
  }
});

adminInquiryRoutes.put("/inquiries/:id", authRequired, async (req, res, next) => {
  try {
    const row = await get("SELECT data FROM inquiries WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ message: "Inquiry not found." });

    const existing = JSON.parse(row.data);
    const notes = req.body.notes
      ? [...(existing.notes || []), req.body.notes]
      : existing.notes || [];
    const updated = {
      ...existing,
      ...req.body,
      notes,
      _id: req.params.id
    };

    await run("UPDATE inquiries SET data = ?, updated_at = ? WHERE id = ?", [
      JSON.stringify(updated),
      new Date().toISOString(),
      req.params.id
    ]);

    return res.json({ success: true, message: "Inquiry updated successfully.", inquiry: updated });
  } catch (error) {
    return next(error);
  }
});
