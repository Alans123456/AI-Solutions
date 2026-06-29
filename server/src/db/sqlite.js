import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.resolve(__dirname, "sqlite.py");
const sqlitePath = process.env.SQLITE_DB_PATH || path.resolve(__dirname, "../../data/ai_company.sqlite");
const jsonPath = process.env.JSON_DB_PATH || (process.env.VERCEL ? "/tmp/ai_company.json" : "");
const useJsonStore = Boolean(process.env.VERCEL || process.env.USE_JSON_DB === "true");

const pythonCommands = [
  process.env.PYTHON_BIN,
  process.platform === "win32" ? "python" : "python3",
  process.platform === "win32" ? "python3" : "python"
].filter(Boolean);

const emptyStore = () => ({
  users: [],
  content_items: [],
  inquiries: [],
  event_registrations: [],
  career_applications: []
});

function readStore() {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  if (!fs.existsSync(jsonPath)) {
    return emptyStore();
  }

  try {
    return { ...emptyStore(), ...JSON.parse(fs.readFileSync(jsonPath, "utf8")) };
  } catch {
    return emptyStore();
  }
}

function writeStore(store) {
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(store, null, 2));
}

function normalize(sql) {
  return sql.replace(/\s+/g, " ").trim();
}

function byDateDesc(field) {
  return (a, b) => new Date(b[field] || 0).getTime() - new Date(a[field] || 0).getTime();
}

function pick(row, fields) {
  return Object.fromEntries(fields.map((field) => [field, row[field]]));
}

function runJson(sql, params = []) {
  const statement = normalize(sql);
  if (statement.startsWith("CREATE TABLE") || statement.startsWith("CREATE INDEX")) {
    return { lastID: 0, changes: 0 };
  }

  const store = readStore();
  let changes = 0;

  if (statement.startsWith("INSERT INTO users")) {
    const [id, email, password_hash, role, created_at] = params;
    store.users.push({ id, email, password_hash, role, created_at });
    changes = 1;
  } else if (statement.startsWith("INSERT INTO content_items")) {
    const [id, type, data, created_at, updated_at] = params;
    store.content_items.push({ id, type, data, created_at, updated_at });
    changes = 1;
  } else if (statement.startsWith("INSERT INTO inquiries")) {
    const [id, data, created_at, updated_at] = params;
    store.inquiries.push({ id, data, created_at, updated_at });
    changes = 1;
  } else if (statement.startsWith("INSERT INTO event_registrations")) {
    const [id, event_id, data, created_at] = params;
    store.event_registrations.push({ id, event_id, data, created_at });
    changes = 1;
  } else if (statement.startsWith("INSERT INTO career_applications")) {
    const [id, career_id, data, created_at, updated_at] = params;
    store.career_applications.push({ id, career_id, data, created_at, updated_at });
    changes = 1;
  } else if (statement.startsWith("UPDATE content_items SET data = ?, updated_at = ? WHERE type = ? AND id = ?")) {
    const [data, updated_at, type, id] = params;
    const item = store.content_items.find((row) => row.type === type && row.id === id);
    if (item) {
      Object.assign(item, { data, updated_at });
      changes = 1;
    }
  } else if (statement.startsWith("UPDATE inquiries SET data = ?, updated_at = ? WHERE id = ?")) {
    const [data, updated_at, id] = params;
    const item = store.inquiries.find((row) => row.id === id);
    if (item) {
      Object.assign(item, { data, updated_at });
      changes = 1;
    }
  } else if (statement.startsWith("UPDATE career_applications SET data = ?, updated_at = ? WHERE id = ?")) {
    const [data, updated_at, id] = params;
    const item = store.career_applications.find((row) => row.id === id);
    if (item) {
      Object.assign(item, { data, updated_at });
      changes = 1;
    }
  } else if (statement.startsWith("UPDATE users SET email = ?, role = ?, password_hash = ? WHERE id = ?")) {
    const [email, role, password_hash, id] = params;
    const user = store.users.find((row) => row.id === id);
    if (user) {
      Object.assign(user, { email, role, password_hash });
      changes = 1;
    }
  } else if (statement.startsWith("UPDATE users SET email = ?, role = ? WHERE id = ?")) {
    const [email, role, id] = params;
    const user = store.users.find((row) => row.id === id);
    if (user) {
      Object.assign(user, { email, role });
      changes = 1;
    }
  } else if (statement.startsWith("DELETE FROM content_items WHERE type = ? AND id = ?")) {
    const [type, id] = params;
    const next = store.content_items.filter((row) => !(row.type === type && row.id === id));
    changes = store.content_items.length - next.length;
    store.content_items = next;
  } else if (statement.startsWith("DELETE FROM users WHERE id = ?")) {
    const [id] = params;
    const next = store.users.filter((row) => row.id !== id);
    changes = store.users.length - next.length;
    store.users = next;
  } else {
    throw new Error(`Unsupported database write: ${statement}`);
  }

  if (changes) writeStore(store);
  return { lastID: 0, changes };
}

function selectJson(sql, params = [], mode = "all") {
  const statement = normalize(sql);
  const store = readStore();
  let rows;

  if (statement === "SELECT id FROM users WHERE email = ?") {
    rows = store.users.filter((row) => row.email === params[0]).map((row) => pick(row, ["id"]));
  } else if (statement === "SELECT * FROM users WHERE email = ?") {
    rows = store.users.filter((row) => row.email === params[0]);
  } else if (statement === "SELECT id, email, role FROM users WHERE id = ?") {
    rows = store.users.filter((row) => row.id === params[0]).map((row) => pick(row, ["id", "email", "role"]));
  } else if (statement === "SELECT id, email, role, created_at FROM users ORDER BY datetime(created_at) DESC") {
    rows = [...store.users].sort(byDateDesc("created_at")).map((row) => pick(row, ["id", "email", "role", "created_at"]));
  } else if (statement === "SELECT id, data FROM content_items WHERE type = ? ORDER BY datetime(updated_at) DESC") {
    rows = store.content_items
      .filter((row) => row.type === params[0])
      .sort(byDateDesc("updated_at"))
      .map((row) => pick(row, ["id", "data"]));
  } else if (statement === "SELECT id, data FROM content_items WHERE type = ? AND id = ?") {
    rows = store.content_items
      .filter((row) => row.type === params[0] && row.id === params[1])
      .map((row) => pick(row, ["id", "data"]));
  } else if (statement === "SELECT data FROM content_items WHERE type = ? AND id = ?") {
    rows = store.content_items
      .filter((row) => row.type === params[0] && row.id === params[1])
      .map((row) => pick(row, ["data"]));
  } else if (statement === "SELECT data FROM inquiries") {
    rows = store.inquiries.map((row) => pick(row, ["data"]));
  } else if (statement === "SELECT data FROM inquiries ORDER BY datetime(created_at) DESC") {
    rows = [...store.inquiries].sort(byDateDesc("created_at")).map((row) => pick(row, ["data"]));
  } else if (statement === "SELECT data FROM inquiries WHERE id = ?") {
    rows = store.inquiries.filter((row) => row.id === params[0]).map((row) => pick(row, ["data"]));
  } else if (statement === "SELECT data FROM career_applications ORDER BY datetime(created_at) DESC") {
    rows = [...store.career_applications].sort(byDateDesc("created_at")).map((row) => pick(row, ["data"]));
  } else if (statement === "SELECT data FROM career_applications WHERE id = ?") {
    rows = store.career_applications.filter((row) => row.id === params[0]).map((row) => pick(row, ["data"]));
  } else {
    throw new Error(`Unsupported database read: ${statement}`);
  }

  return mode === "get" ? rows[0] || null : rows;
}

function runSqliteWithPython(command, payload) {
  return new Promise((resolve, reject) => {
    const child = execFile(command, [scriptPath], { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        error.stderr = stderr;
        reject(new Error(stderr || error.message));
        return;
      }
      try {
        resolve(stdout.trim() ? JSON.parse(stdout) : null);
      } catch (parseError) {
        reject(parseError);
      }
    });

    child.stdin?.write(JSON.stringify(payload));
    child.stdin?.end();
  });
}

async function queryWithPython(sql, params, mode) {
  const payload = { dbPath: sqlitePath, sql, params, mode };
  let lastError;

  for (const command of pythonCommands) {
    try {
      return await runSqliteWithPython(command, payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to run SQLite helper.");
}

async function query(sql, params = [], mode = "all") {
  if (useJsonStore) {
    return mode === "run" ? runJson(sql, params) : selectJson(sql, params, mode);
  }

  return queryWithPython(sql, params, mode);
}

export function run(sql, params = []) {
  return query(sql, params, "run");
}

export function get(sql, params = []) {
  return query(sql, params, "get");
}

export function all(sql, params = []) {
  return query(sql, params, "all");
}
