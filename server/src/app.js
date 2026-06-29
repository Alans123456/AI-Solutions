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

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "https://ai-solutions-black.vercel.app",
  "https://ai-solutions-9n7a.vercel.app"
];

const allowedOrigins = [
  ...defaultAllowedOrigins,
  ...(process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
]
  .filter(Boolean)
  .filter((origin, index, origins) => origins.indexOf(origin) === index);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) return true;
  return /^https:\/\/ai-solutions-[a-z0-9-]+\.vercel\.app$/i.test(origin);
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "3mb" }));
app.use(morgan("dev"));

const publicRoutes = [
  "GET /api/health",
  "GET /api/services",
  "GET /api/projects",
  "GET /api/blog",
  "GET /api/blog/:id",
  "GET /api/events",
  "GET /api/events/:id",
  "GET /api/careers",
  "GET /api/gallery",
  "GET /api/testimonials",
  "GET /api/team",
  "GET /api/faqs",
  "POST /api/contact",
  "POST /api/chat"
];

app.get("/", (_req, res) => {
  const frontendUrl = process.env.CLIENT_ORIGIN || "https://ai-solutions-black.vercel.app";
  const routeLinks = publicRoutes
    .map((route) => {
      const [method, path] = route.split(" ");
      const href = path.includes(":") ? null : path;
      return `
        <li>
          <span class="method">${method}</span>
          ${
            href
              ? `<a href="${href}">${path}</a>`
              : `<span class="path">${path}</span>`
          }
        </li>`;
    })
    .join("");

  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Solution API</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #111827;
        background: #f7f8fb;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 32px;
      }
      main {
        width: min(980px, 100%);
        background: #fff;
        border: 1px solid #d8dee9;
        border-radius: 8px;
        box-shadow: 0 20px 50px rgba(17, 24, 39, 0.08);
        overflow: hidden;
      }
      header {
        padding: 34px 38px;
        border-bottom: 1px solid #e5e7eb;
        background: linear-gradient(135deg, #101828, #1f2937);
        color: white;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding: 7px 11px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 999px;
        font-size: 13px;
        font-weight: 700;
      }
      .dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
      }
      h1 {
        margin: 0 0 10px;
        font-size: clamp(32px, 5vw, 56px);
        line-height: 1;
        letter-spacing: 0;
      }
      p {
        margin: 0;
        max-width: 680px;
        color: #d1d5db;
        font-size: 17px;
        line-height: 1.65;
      }
      section {
        padding: 30px 38px 38px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 28px;
      }
      a.button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 16px;
        border-radius: 6px;
        background: #111827;
        color: white;
        text-decoration: none;
        font-weight: 800;
      }
      a.button.secondary {
        background: white;
        color: #111827;
        border: 1px solid #cbd5e1;
      }
      h2 {
        margin: 0 0 16px;
        font-size: 20px;
      }
      ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 10px;
        list-style: none;
        padding: 0;
        margin: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 10px;
        min-height: 46px;
        padding: 10px 12px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: #f9fafb;
      }
      .method {
        flex: 0 0 auto;
        min-width: 46px;
        padding: 5px 7px;
        border-radius: 4px;
        background: #e8f1ff;
        color: #0f4da2;
        font-size: 12px;
        font-weight: 900;
        text-align: center;
      }
      li a,
      .path {
        color: #1f2937;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        overflow-wrap: anywhere;
      }
      footer {
        padding: 18px 38px;
        border-top: 1px solid #e5e7eb;
        color: #6b7280;
        font-size: 13px;
      }
      @media (max-width: 640px) {
        body {
          padding: 16px;
        }
        header,
        section,
        footer {
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="badge"><span class="dot"></span> Backend online</div>
        <h1>AI Solution API</h1>
        <p>This is the live backend for the AI Solution website. Public website data, contact forms, careers, events, FAQs, and chat requests are served from here.</p>
      </header>
      <section>
        <div class="actions">
          <a class="button" href="${frontendUrl}">Open Website</a>
          <a class="button secondary" href="/api/health">Health Check</a>
          <a class="button secondary" href="/api">API JSON</a>
        </div>
        <h2>Public Endpoints</h2>
        <ul>${routeLinks}</ul>
      </section>
      <footer>Admin endpoints are protected and require an admin login token.</footer>
    </main>
  </body>
</html>`);
});

app.get("/api", (_req, res) => {
  res.json({
    name: "AI Solution API",
    ok: true,
    health: "/api/health",
    frontend: process.env.CLIENT_ORIGIN || "https://ai-solutions-black.vercel.app",
    routes: publicRoutes
  });
});

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
