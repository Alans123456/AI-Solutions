import { app } from "../src/app.js";
import { initDatabase } from "../src/db/schema.js";

let databaseReady;

function ensureDatabase() {
  if (!databaseReady) {
    databaseReady = initDatabase();
  }
  return databaseReady;
}

export default async function handler(req, res) {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        message: error.message || "Server error"
      })
    );
  }
}
