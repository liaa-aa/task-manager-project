import { getDB, setDB, nextId } from "./storage.js";
import { getSession } from "./auth.service.js";

export function listCategories() {
  const session = getSession();
  const db = getDB();
  return db.categories.filter((c) => c.user_id === session.user.id);
}

export function createCategory({ name }) {
  const session = getSession();
  const db = getDB();
  const now = new Date().toISOString();

  const id = nextId("category");
  const cat = { id, user_id: session.user.id, name: name.trim(), created_at: now };
  db.categories.push(cat);
  setDB(db);
  return cat;
}

export function updateCategory(id, { name }) {
  const session = getSession();
  const db = getDB();
  const cat = db.categories.find((c) => c.id === id && c.user_id === session.user.id);
  if (!cat) throw new Error("Category tidak ditemukan.");
  cat.name = name.trim();
  setDB(db);
  return cat;
}

export function deleteCategory(id) {
  const session = getSession();
  const db = getDB();
  db.categories = db.categories.filter((c) => !(c.id === id && c.user_id === session.user.id));

  // Optional: set task.category_id = null kalau category dihapus
  db.tasks.forEach((t) => {
    if (t.user_id === session.user.id && t.category_id === id) t.category_id = null;
  });

  setDB(db);
}
