import React, { createContext, useContext, useMemo, useState } from "react";

const DataContext = createContext(null);

const seed = () => {
  const now = new Date().toISOString();
  return {
    categories: [
      { id: 1, name: "Personal", created_at: now },
      { id: 2, name: "Work", created_at: now },
    ],
    statuses: [
      { id: 1, name: "Todo" },
      { id: 2, name: "Doing" },
      { id: 3, name: "Done" },
    ],
    priorities: [
      { id: 1, name: "Low" },
      { id: 2, name: "Medium" },
      { id: 3, name: "High" },
    ],
    tasks: [
      {
        id: 1,
        title: "Buat UI Task Manager",
        description: "Fokus UI dulu, integrasi belakangan",
        due_date: "",
        category_id: 2,
        status_id: 1,
        priority_id: 2,
        created_at: now,
        updated_at: now,
      },
    ],
    counters: { task: 1, category: 2, status: 3, priority: 3 },
  };
};

function loadDB() {
  try {
    const raw = localStorage.getItem("tm_ui_db");
    if (raw) return JSON.parse(raw);
  } catch {}
  const db = seed();
  localStorage.setItem("tm_ui_db", JSON.stringify(db));
  return db;
}
function saveDB(db) {
  localStorage.setItem("tm_ui_db", JSON.stringify(db));
}

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadDB());

  const commit = (next) => {
    setDb(next);
    saveDB(next);
  };

  const api = useMemo(() => {
    // --- helpers ---
    const nextId = (type) => db.counters[type] + 1;

    // --- Categories ---
    const createCategory = (name) => {
      const id = nextId("category");
      const now = new Date().toISOString();
      const next = {
        ...db,
        categories: [...db.categories, { id, name: name.trim(), created_at: now }],
        counters: { ...db.counters, category: id },
      };
      commit(next);
    };

    const updateCategory = (id, name) => {
      const next = {
        ...db,
        categories: db.categories.map((c) => (c.id === id ? { ...c, name: name.trim() } : c)),
      };
      commit(next);
    };

    const deleteCategory = (id) => {
      const next = {
        ...db,
        categories: db.categories.filter((c) => c.id !== id),
        tasks: db.tasks.map((t) => (t.category_id === id ? { ...t, category_id: null } : t)),
      };
      commit(next);
    };

    // --- Statuses ---
    const createStatus = (name) => {
      const id = nextId("status");
      const next = {
        ...db,
        statuses: [...db.statuses, { id, name: name.trim() }],
        counters: { ...db.counters, status: id },
      };
      commit(next);
    };

    const updateStatus = (id, name) => {
      const next = { ...db, statuses: db.statuses.map((s) => (s.id === id ? { ...s, name: name.trim() } : s)) };
      commit(next);
    };

    const deleteStatus = (id) => {
      const next = { ...db, statuses: db.statuses.filter((s) => s.id !== id) };
      commit(next);
    };

    // --- Priorities ---
    const createPriority = (name) => {
      const id = nextId("priority");
      const next = {
        ...db,
        priorities: [...db.priorities, { id, name: name.trim() }],
        counters: { ...db.counters, priority: id },
      };
      commit(next);
    };

    const updatePriority = (id, name) => {
      const next = {
        ...db,
        priorities: db.priorities.map((p) => (p.id === id ? { ...p, name: name.trim() } : p)),
      };
      commit(next);
    };

    const deletePriority = (id) => {
      const next = { ...db, priorities: db.priorities.filter((p) => p.id !== id) };
      commit(next);
    };

    // --- Tasks ---
    const createTask = (payload) => {
      const id = nextId("task");
      const now = new Date().toISOString();
      const task = {
        id,
        title: payload.title.trim(),
        description: payload.description?.trim() || "",
        due_date: payload.due_date || "",
        category_id: payload.category_id ? Number(payload.category_id) : null,
        status_id: Number(payload.status_id),
        priority_id: Number(payload.priority_id),
        created_at: now,
        updated_at: now,
      };
      const next = {
        ...db,
        tasks: [...db.tasks, task],
        counters: { ...db.counters, task: id },
      };
      commit(next);
    };

    const updateTask = (id, patch) => {
      const now = new Date().toISOString();
      const next = {
        ...db,
        tasks: db.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                ...patch,
                title: (patch.title ?? t.title).trim(),
                description: patch.description ?? t.description,
                due_date: patch.due_date ?? t.due_date,
                category_id: patch.category_id === "" ? null : (patch.category_id ?? t.category_id),
                status_id: Number(patch.status_id ?? t.status_id),
                priority_id: Number(patch.priority_id ?? t.priority_id),
                updated_at: now,
              }
            : t
        ),
      };
      commit(next);
    };

    const deleteTask = (id) => {
      const next = { ...db, tasks: db.tasks.filter((t) => t.id !== id) };
      commit(next);
    };

    return {
      db,
      createCategory,
      updateCategory,
      deleteCategory,
      createStatus,
      updateStatus,
      deleteStatus,
      createPriority,
      updatePriority,
      deletePriority,
      createTask,
      updateTask,
      deleteTask,
    };
  }, [db]);

  return <DataContext.Provider value={api}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
