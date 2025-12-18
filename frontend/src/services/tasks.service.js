import { getDB, setDB, nextId } from "./storage.js";
import { getSession } from "./auth.service.js";

export function listMeta() {
  const db = getDB();
  return { statuses: db.statuses, priorities: db.priorities };
}

export function listTasks(filters = {}) {
  const session = getSession();
  const db = getDB();
  let items = db.tasks.filter((t) => t.user_id === session.user.id);

  if (filters.status_id) items = items.filter((t) => t.status_id === Number(filters.status_id));
  if (filters.priority_id) items = items.filter((t) => t.priority_id === Number(filters.priority_id));
  if (filters.category_id === "none") items = items.filter((t) => t.category_id == null);
  if (filters.category_id && filters.category_id !== "none")
    items = items.filter((t) => t.category_id === Number(filters.category_id));

  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter((t) => (t.title || "").toLowerCase().includes(q));
  }

  // sort: due date (null last)
  items.sort((a, b) => {
    const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return ad - bd;
  });

  return items;
}

export function createTask(payload) {
  const session = getSession();
  const db = getDB();
  const now = new Date().toISOString();

  const id = nextId("task");
  const task = normalizeTask({
    id,
    user_id: session.user.id,
    created_at: now,
    updated_at: now,
    ...payload,
  });

  db.tasks.push(task);
  setDB(db);
  return task;
}

export function updateTask(id, payload) {
  const session = getSession();
  const db = getDB();
  const task = db.tasks.find((t) => t.id === id && t.user_id === session.user.id);
  if (!task) throw new Error("Task tidak ditemukan.");

  Object.assign(task, normalizeTask({ ...task, ...payload, updated_at: new Date().toISOString() }));
  setDB(db);
  return task;
}

export function deleteTask(id) {
  const session = getSession();
  const db = getDB();
  db.tasks = db.tasks.filter((t) => !(t.id === id && t.user_id === session.user.id));
  setDB(db);
}

function normalizeTask(t) {
  return {
    ...t,
    title: (t.title || "").trim(),
    description: t.description?.trim() || null,
    due_date: t.due_date ? new Date(t.due_date).toISOString() : null,
    category_id: t.category_id === "" || t.category_id == null ? null : Number(t.category_id),
    status_id: Number(t.status_id),
    priority_id: Number(t.priority_id),
  };
}
