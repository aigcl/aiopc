import http from "node:http";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const PORT = Number(process.env.PORT || 8787);
const HOST = process.env.HOST || "127.0.0.1";
const dataDir = join(dirname(fileURLToPath(import.meta.url)), "..", "data");
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(join(dataDir, "opc.sqlite"));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'founder',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK(kind IN ('project','talent','demand')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    budget TEXT,
    city TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(listing_id) REFERENCES listings(id)
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
`);
const allowedOrigins = new Set([
  "http://127.0.0.1:4173", "http://127.0.0.1:4181", "http://127.0.0.1:4178",
  "http://localhost:4173", "http://localhost:4181", "http://localhost:4178",
]);
const json = (res, status, value, req) => {
  const origin = req?.headers?.origin;
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Credentials": "true" };
  if (origin && allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  res.writeHead(status, headers);
  res.end(JSON.stringify(value));
};
const readBody = (req) => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", (chunk) => { raw += chunk; if (raw.length > 128 * 1024) reject(new Error("payload too large")); });
  req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("invalid json")); } });
  req.on("error", reject);
});
const passwordHash = (password, salt = randomBytes(16).toString("hex")) => `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const verifyPassword = (password, encoded) => {
  const [salt, expected] = String(encoded).split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
};
const safeUser = (user) => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const cookie = (req, name) => (req.headers.cookie || "").split(";").map((x) => x.trim().split("=")).find(([key]) => key === name)?.[1];
const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
const authUser = (req) => {
  const token = cookie(req, "opc_session");
  if (!token || !/^[a-f0-9]{48}$/.test(token)) return null;
  return db.prepare("SELECT users.id,users.name,users.email,users.role FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND users.status = 'active'").get(tokenHash(token), Date.now());
};
const sessionCookie = (sid, maxAge = 604800) => `opc_session=${sid}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
const newSession = (userId) => {
  const sid = randomBytes(24).toString("hex");
  db.prepare("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES (?,?,?)").run(tokenHash(sid), userId, Date.now() + 604800000);
  return sid;
};

const route = async (req, res) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    const headers = { "Access-Control-Allow-Credentials": "true", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" };
    if (origin && allowedOrigins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
    res.writeHead(204, headers); return res.end();
  }
  try {
    if (req.method === "GET" && req.url === "/api/health") return json(res, 200, { ok: true, service: "ai-opc-api" }, req);
    if (req.method === "POST" && req.url === "/api/auth/register") {
      const body = await readBody(req); const name = String(body.name || "").trim(); const email = String(body.email || "").trim().toLowerCase(); const password = String(body.password || ""); const role = String(body.role || "founder");
      if (name.length < 2 || name.length > 80 || email.length > 254 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 10 || password.length > 128 || !["founder", "project_owner", "talent", "institution"].includes(role)) return json(res, 400, { message: "请检查姓名、邮箱、身份和密码长度" }, req);
      if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) return json(res, 409, { message: "该邮箱已经注册" }, req);
      const result = db.prepare("INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)").run(name, email, passwordHash(password), role);
      const user = db.prepare("SELECT id,name,email,role FROM users WHERE id = ?").get(result.lastInsertRowid);
      const sid = newSession(user.id); res.setHeader("Set-Cookie", sessionCookie(sid));
      return json(res, 201, { user: safeUser(user) }, req);
    }
    if (req.method === "POST" && req.url === "/api/auth/login") {
      const body = await readBody(req); const email = String(body.email || "").trim().toLowerCase(); const password = String(body.password || ""); const user = db.prepare("SELECT * FROM users WHERE email = ? AND status = 'active'").get(email);
      if (!user || !verifyPassword(password, user.password_hash)) return json(res, 401, { message: "邮箱或密码不正确" }, req);
      const sid = newSession(user.id); res.setHeader("Set-Cookie", sessionCookie(sid));
      return json(res, 200, { user: safeUser(user) }, req);
    }
    if (req.method === "POST" && req.url === "/api/auth/logout") { const sid = cookie(req, "opc_session"); if (sid && /^[a-f0-9]{48}$/.test(sid)) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(sid)); res.setHeader("Set-Cookie", sessionCookie("", 0)); return json(res, 200, { ok: true }, req); }
    if (req.method === "GET" && req.url === "/api/auth/me") { const user = authUser(req); return json(res, 200, { user: user ? safeUser(user) : null }, req); }
    if (req.method === "GET" && req.url === "/api/listings") { const rows = db.prepare("SELECT id,kind,title,body,budget,city,status,created_at FROM listings WHERE status = 'approved' ORDER BY id DESC LIMIT 100").all(); return json(res, 200, { items: rows }, req); }
    if (req.method === "POST" && req.url === "/api/listings") {
      const user = authUser(req); if (!user) return json(res, 401, { message: "请先登录" }, req);
      const body = await readBody(req); const kind = String(body.kind || "demand"); if (!["project", "talent", "demand"].includes(kind)) return json(res, 400, { message: "不支持的发布类型" }, req);
      const title = String(body.title || "").trim(); const text = String(body.body || "").trim(); if (title.length < 4 || title.length > 120 || text.length < 10 || text.length > 5000 || String(body.city || "").length > 80 || String(body.budget || "").length > 80) return json(res, 400, { message: "请补充完整标题和说明，且勿超过字数限制" }, req);
      const result = db.prepare("INSERT INTO listings (user_id,kind,title,body,budget,city) VALUES (?,?,?,?,?,?)").run(user.id, kind, title, text, String(body.budget || ""), String(body.city || ""));
      return json(res, 201, { id: result.lastInsertRowid, status: "pending_review" }, req);
    }
    if (req.method === "POST" && req.url === "/api/reports") {
      const user = authUser(req); if (!user) return json(res, 401, { message: "请先登录" }, req);
      const body = await readBody(req); const listingId = Number(body.listingId); const reason = String(body.reason || "").trim();
      if (!Number.isInteger(listingId) || listingId < 1 || reason.length < 5 || reason.length > 500) return json(res, 400, { message: "请补充有效的举报原因" }, req);
      if (!db.prepare("SELECT id FROM listings WHERE id = ?").get(listingId)) return json(res, 404, { message: "内容不存在" }, req);
      const result = db.prepare("INSERT INTO reports (listing_id,reason) VALUES (?,?)").run(listingId, reason);
      return json(res, 201, { id: result.lastInsertRowid, status: "open" }, req);
    }
    return json(res, 404, { message: "未找到接口" }, req);
  } catch (error) { return json(res, 500, { message: error instanceof Error ? error.message : "服务器错误" }, req); }
};
http.createServer(route).listen(PORT, HOST, () => console.log(`AI OPC API listening at http://${HOST}:${PORT}`));
