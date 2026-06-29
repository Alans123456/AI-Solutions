import express from "express";
import { v4 as uuid } from "uuid";
import { run } from "../db/sqlite.js";

export const eventRegistrationRoutes = express.Router();

eventRegistrationRoutes.post("/events/:id/register", async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const id = uuid();
    await run(
      "INSERT INTO event_registrations (id, event_id, data, created_at) VALUES (?, ?, ?, ?)",
      [id, req.params.id, JSON.stringify({ _id: id, eventId: req.params.id, ...req.body }), new Date().toISOString()]
    );

    return res.status(201).json({ success: true, message: "Successfully registered for the event." });
  } catch (error) {
    return next(error);
  }
});
