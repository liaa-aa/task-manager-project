import { getDB, setDB, nextId } from "./storage.js";

export function getSession() {
  return getDB().session;
}

export function logout() {
  const db = getDB();
  db.session = null;
  setDB(db);
}

export function register({ name, email, password }) {
  const db = getDB();
  const exist = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exist) throw new Error("Email sudah terdaftar.");

  const id = nextId("user");
  const now = new Date().toISOString();
  const user = {
    id,
    name,
    email,
    password_hash: password, // mock hash
    created_at: now,
  };
  db.users.push(user);
  db.session = { token: `mock-token-${id}`, user: { id, name, email } };
  setDB(db);
  return db.session;
}

export function login({ email, password }) {
  const db = getDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("Email tidak ditemukan.");
  if (user.password_hash !== password) throw new Error("Password salah.");

  db.session = { token: `mock-token-${user.id}`, user: { id: user.id, name: user.name, email: user.email } };
  setDB(db);
  return db.session;
}
