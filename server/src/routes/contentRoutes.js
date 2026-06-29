import express from "express";
import {
  createContent,
  deleteContent,
  getContent,
  listContent,
  responseKey,
  updateContent
} from "../db/contentRepository.js";
import { authRequired } from "../middleware/authRequired.js";

export const publicContentRoutes = express.Router();
export const adminContentRoutes = express.Router();

const types = ["services", "projects", "blog", "events", "testimonials", "gallery", "team", "faqs", "careers"];

for (const type of types) {
  publicContentRoutes.get(`/${type}`, async (_req, res, next) => {
    try {
      const items = await listContent(type);
      return res.json({ [responseKey(type)]: items });
    } catch (error) {
      return next(error);
    }
  });

  adminContentRoutes.get(`/${type}`, authRequired, async (_req, res, next) => {
    try {
      const items = await listContent(type, { includeDrafts: true });
      return res.json({ [responseKey(type)]: items });
    } catch (error) {
      return next(error);
    }
  });

  adminContentRoutes.post(`/${type}`, authRequired, async (req, res, next) => {
    try {
      const item = await createContent(type, req.body || {});
      return res.status(201).json({ [type === "blog" ? "post" : "item"]: item, success: true });
    } catch (error) {
      return next(error);
    }
  });

  adminContentRoutes.put(`/${type}/:id`, authRequired, async (req, res, next) => {
    try {
      const item = await updateContent(type, req.params.id, req.body || {});
      if (!item) return res.status(404).json({ message: "Record not found in SQLite." });
      return res.json({ [type === "blog" ? "post" : "item"]: item, success: true });
    } catch (error) {
      return next(error);
    }
  });

  adminContentRoutes.delete(`/${type}/:id`, authRequired, async (req, res, next) => {
    try {
      const deleted = await deleteContent(type, req.params.id);
      if (!deleted) return res.status(404).json({ message: "Record not found in SQLite." });
      return res.json({ success: true, message: "Record deleted." });
    } catch (error) {
      return next(error);
    }
  });
}

publicContentRoutes.get("/blog/:id", async (req, res, next) => {
  try {
    const post = await getContent("blog", req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post not found." });
    return res.json({ post });
  } catch (error) {
    return next(error);
  }
});

publicContentRoutes.get("/events/:id", async (req, res, next) => {
  try {
    const event = await getContent("events", req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found." });
    return res.json({ event });
  } catch (error) {
    return next(error);
  }
});
