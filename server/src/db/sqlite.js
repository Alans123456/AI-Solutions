import { execFile } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "../../data/ai_company.sqlite");
const scriptPath = path.resolve(__dirname, "sqlite.py");

const pythonCommands = [
  process.env.PYTHON_BIN,
  process.platform === "win32" ? "python" : "python3",
  process.platform === "win32" ? "python3" : "python"
].filter(Boolean);

function runSqlite(command, payload) {
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

async function query(sql, params = [], mode = "all") {
  const payload = { dbPath, sql, params, mode };
  let lastError;

  for (const command of pythonCommands) {
    try {
      return await runSqlite(command, payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to run SQLite helper. Set PYTHON_BIN to a Python 3 executable.");
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
