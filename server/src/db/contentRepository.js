import { v4 as uuid } from "uuid";
import { all, get, run } from "./sqlite.js";
import { mockData } from "../data/mockData.js";

const responseKeys = {
  services: "services",
  projects: "projects",
  blog: "posts",
  events: "events",
  testimonials: "testimonials",
  gallery: "images",
  team: "members",
  faqs: "faqs",
  careers: "jobs"
};

const validTypes = new Set(Object.keys(responseKeys));

export function assertValidType(type) {
  if (!validTypes.has(type)) {
    const error = new Error(`Unsupported content type: ${type}`);
    error.status = 404;
    throw error;
  }
}

export function responseKey(type) {
  return responseKeys[type];
}

function parseRow(row) {
  return {
    ...JSON.parse(row.data),
    _id: row.id
  };
}

export async function listContent(type, { includeDrafts = false } = {}) {
  assertValidType(type);
  const rows = await all(
    "SELECT id, data FROM content_items WHERE type = ? ORDER BY datetime(updated_at) DESC",
    [type]
  );

  let items = rows.map(parseRow);

  if (!includeDrafts) {
    items = items.filter((item) => {
      if (!item.status) return true;
      return ["Published", "Approved", "Image", "Active"].includes(item.status);
    });
  }

  if (items.length === 0) {
    return mockData[type] || [];
  }

  return items;
}

export async function getContent(type, id, { includeDrafts = false } = {}) {
  assertValidType(type);
  const row = await get("SELECT id, data FROM content_items WHERE type = ? AND id = ?", [type, id]);
  if (row) return parseRow(row);

  const fallback = (mockData[type] || []).find((item) => item._id === id);
  if (!fallback) return null;
  if (!includeDrafts && fallback.status && !["Published", "Approved", "Image", "Active"].includes(fallback.status)) {
    return null;
  }
  return fallback;
}

export async function createContent(type, payload) {
  assertValidType(type);
  const now = new Date().toISOString();
  const id = uuid();
  const item = {
    ...payload,
    _id: id,
    isMock: false
  };

  await run(
    "INSERT INTO content_items (id, type, data, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [id, type, JSON.stringify(item), now, now]
  );

  return item;
}

export async function updateContent(type, id, payload) {
  assertValidType(type);
  const existing = await get("SELECT data FROM content_items WHERE type = ? AND id = ?", [type, id]);
  if (!existing) return null;

  const now = new Date().toISOString();
  const current = JSON.parse(existing.data);
  const item = {
    ...current,
    ...payload,
    _id: id,
    isMock: false
  };

  await run(
    "UPDATE content_items SET data = ?, updated_at = ? WHERE type = ? AND id = ?",
    [JSON.stringify(item), now, type, id]
  );

  return item;
}

export async function deleteContent(type, id) {
  assertValidType(type);
  const result = await run("DELETE FROM content_items WHERE type = ? AND id = ?", [type, id]);
  return result.changes > 0;
}
