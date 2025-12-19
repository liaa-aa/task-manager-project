import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const LS_USERS = "tm_users";
const LS_SESSION = "tm_session";
const LS_DB = "tm_db";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Seed initial data (DB + Demo user) jika localStorage belum punya data.
 */
function seedIfEmpty() {
  // Seed DB
  const db = loadJSON(LS_DB, null);
  if (!db) {
    const initial = {
      categories: [
        { id: "c1", name: "Work" },
        { id: "c2", name: "Personal" },
        { id: "c3", name: "Study" },
      ],
      tasks: [],
    };
    saveJSON(LS_DB, initial);
  }

  // Seed Users (buat demo user)
  const users = loadJSON(LS_USERS, null);

  // Kalau key belum ada atau isinya bukan array, seed ulang
  if (!Array.isArray(users)) {
    saveJSON(LS_USERS, [
      {
        id: "u1",
        name: "Demo User",
        email: "demo@demo.com",
        password: "demo",
      },
    ]);
    return;
  }

  // Kalau array tapi kosong, tambahkan demo user
  if (users.length === 0) {
    saveJSON(LS_USERS, [
      {
        id: "u1",
        name: "Demo User",
        email: "demo@demo.com",
        password: "demo",
      },
    ]);
    return;
  }

  // Kalau sudah ada users, pastikan demo user ada (tidak dobel)
  const hasDemo = users.some((u) => (u.email || "").toLowerCase() === "demo@demo.com");
  if (!hasDemo) {
    saveJSON(LS_USERS, [
      ...users,
      {
        id: "u1",
        name: "Demo User",
        email: "demo@demo.com",
        password: "demo",
      },
    ]);
  }
}

export function AppProvider({ children }) {
  useEffect(() => {
    seedIfEmpty();
  }, []);

  const [users, setUsers] = useState(() => loadJSON(LS_USERS, []));
  const [session, setSession] = useState(() => loadJSON(LS_SESSION, null));
  const [db, setDb] = useState(() => loadJSON(LS_DB, { categories: [], tasks: [] }));

  useEffect(() => saveJSON(LS_USERS, users), [users]);
  useEffect(() => saveJSON(LS_SESSION, session), [session]);
  useEffect(() => saveJSON(LS_DB, db), [db]);

  const api = useMemo(() => {
    return {
      // ---- auth ----
      session,
      user: session ? users.find((u) => u.id === session.userId) : null,

      register({ name, email, password }) {
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) throw new Error("Email sudah terdaftar.");

        const newUser = {
          id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
          name: name.trim(),
          email: email.trim(),
          password, // UI-only (submission kecil)
        };

        setUsers((prev) => [newUser, ...prev]);
        setSession({ userId: newUser.id, token: "mock-token" });
      },

      login({ email, password }) {
        const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (!u) throw new Error("Email tidak ditemukan.");
        if (u.password !== password) throw new Error("Password salah.");

        setSession({ userId: u.id, token: "mock-token" });
      },

      logout() {
        setSession(null);
      },

      // ---- data (scoped per user) ----
      categories: db.categories,

      tasksForUser(userId) {
        return (db.tasks || []).filter((t) => t.user_id === userId);
      },

      addTask(userId, payload) {
        const newTask = {
          id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
          user_id: userId,
          title: payload.title.trim(),
          description: payload.description?.trim() || "",
          category_id: payload.category_id || "",
          due_date: payload.due_date || "",
          created_at: new Date().toISOString(),
        };

        setDb((prev) => ({ ...prev, tasks: [newTask, ...(prev.tasks || [])] }));
      },

      deleteTask(taskId) {
        setDb((prev) => ({
          ...prev,
          tasks: (prev.tasks || []).filter((t) => t.id !== taskId),
        }));
      },
    };
  }, [users, session, db]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
