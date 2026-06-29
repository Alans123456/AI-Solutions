import dotenv from "dotenv";
import express from "express";
import { app } from "./app.js";
import { initDatabase } from "./db/schema.js";

dotenv.config();

const port = Number(process.env.PORT || 3000);
const logPort = Number(process.env.LOCAL_LOG_PORT || 4444);

await initDatabase();

app.listen(port, () => {
  console.log(`AI Company backend running on http://localhost:${port}`);
});

// Some Pythagora-generated projects try to POST browser logs to localhost:4444/logs.
// This tiny listener prevents ERR_CONNECTION_REFUSED during local development.
if (process.env.DISABLE_LOCAL_LOG_SERVER !== "true") {
  const logApp = express();
  logApp.use(express.json({ limit: "1mb" }));
  logApp.post("/logs", (_req, res) => res.status(204).end());
  logApp.get("/health", (_req, res) => res.json({ ok: true }));
  logApp.listen(logPort, () => {
    console.log(`Local dev log receiver running on http://localhost:${logPort}/logs`);
  });
}
