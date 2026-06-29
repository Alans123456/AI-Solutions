import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { get, run } from "./sqlite.js";

export async function initDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type)
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS career_applications (
      id TEXT PRIMARY KEY,
      career_id TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await seedAdmin();
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@aisolution.com";
  const password = process.env.ADMIN_PASSWORD || "Admin12345";
  const existing = await get("SELECT id FROM users WHERE email = ?", [email]);
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 12);
  await run(
    "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
    [uuid(), email, passwordHash, "admin", new Date().toISOString()]
  );
}
