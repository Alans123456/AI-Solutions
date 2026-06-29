import json
import os
import sqlite3
import sys

payload = json.loads(sys.stdin.read())
db_path = payload["dbPath"]
sql = payload["sql"]
params = payload.get("params", [])
mode = payload.get("mode", "all")

os.makedirs(os.path.dirname(db_path), exist_ok=True)
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row

try:
    cur = conn.execute(sql, params)
    if mode == "run":
        conn.commit()
        print(json.dumps({"lastID": cur.lastrowid, "changes": conn.total_changes}))
    elif mode == "get":
        row = cur.fetchone()
        print(json.dumps(dict(row) if row else None))
    else:
        rows = cur.fetchall()
        print(json.dumps([dict(row) for row in rows]))
finally:
    conn.close()
