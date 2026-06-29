import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { adminCareerRoutes, careerRoutes } from "./routes/careerRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { adminContentRoutes, publicContentRoutes } from "./routes/contentRoutes.js";
import { adminInquiryRoutes, contactRoutes } from "./routes/contactRoutes.js";
import { eventRegistrationRoutes } from "./routes/eventRegistrationRoutes.js";
import { adminRequired, authRequired } from "./middleware/authRequired.js";

dotenv.config();

export const app = express();

const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  process.env.CLIENT_ORIGIN ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "3mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api", publicContentRoutes);
app.use("/api", contactRoutes);
app.use("/api", eventRegistrationRoutes);
app.use("/api", careerRoutes);
app.use("/api", chatRoutes);
app.use("/api/admin", authRequired, adminRequired);
app.use("/api/admin", adminContentRoutes);
app.use("/api/admin", adminInquiryRoutes);
app.use("/api/admin", adminCareerRoutes);
app.use("/api/admin", analyticsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const status = error.status || 500;
  console.error(error);
  res.status(status).json({ message: error.message || "Server error" });
});
