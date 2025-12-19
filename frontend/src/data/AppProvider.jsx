import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AppContext = createContext(null);

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

function seedDbIfEmpty() {
  const db = loadJSON(LS_DB, null);
  if (!db) {
    saveJSON(LS_DB, {
      // kategori dibuat user
      categories: [], // { id, user_id, name, created_at }

      // fixed seperti BE (sementara FE pakai local)
      statuses: [
        { id: "1", name: "Todo" },
        { id: "2", name: "Doing" },
        { id: "3", name: "Done" },
      ],
      priorities: [
        { id: "1", name: "Low" },
        { id: "2", name: "Medium" },
        { id: "3", name: "High" },
      ],

      tasks: [], // { id, user_id, title, description, category_id, status_id, priority_id, due_date, created_at }
    });
  }
}

export function AppProvider({ children }) {
  useEffect(() => seedDbIfEmpty(), []);

  const [session, setSession] = useState(() => loadJSON(LS_SESSION, null));
  const [db, setDb] = useState(() =>
    loadJSON(LS_DB, { categories: [], statuses: [], priorities: [], tasks: [] })
  );

  useEffect(() => saveJSON(LS_SESSION, session), [session]);
  useEffect(() => saveJSON(LS_DB, db), [db]);

  const value = useMemo(() => {
    return {
      // ========== AUTH (integrated to BE) ==========
      session,
      user: session?.user || null,

      async register({ name, email, password }) {
        // BE: POST /register -> tidak mengembalikan token
        await api.post("/register", { name, email, password });

        // Auto-login setelah register agar dapat token
        const res = await api.post("/login", { email, password });
        const data = res.data; // { token, user }

        setSession({ token: data.token, user: data.user });
      },

      async login({ email, password }) {
        const res = await api.post("/login", { email, password });
        const data = res.data; // { token, user }
        setSession({ token: data.token, user: data.user });
      },

      logout() {
        setSession(null);
      },

      // ========== UI-ONLY DATA (localStorage sementara) ==========
      statuses: db.statuses || [],
      priorities: db.priorities || [],

      categoriesForUser(userId) {
        return (db.categories || []).filter((c) => c.user_id === userId);
      },

      addCategory(userId, name) {
        const v = name.trim();
        if (!v) throw new Error("Category kosong.");

        // prevent duplicate (case-insensitive) per user
        const exists = (db.categories || []).some(
          (c) => c.user_id === userId && (c.name || "").toLowerCase() === v.toLowerCase()
        );
        if (exists) {
          const found = (db.categories || []).find(
            (c) => c.user_id === userId && (c.name || "").toLowerCase() === v.toLowerCase()
          );
          return found?.id || "";
        }

        const newCat = {
          id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
          user_id: userId,
          name: v,
          created_at: new Date().toISOString(),
        };

        setDb((prev) => ({ ...prev, categories: [newCat, ...(prev.categories || [])] }));
        return newCat.id;
      },

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

          // fixed ids
          status_id: payload.status_id || (db.statuses?.[0]?.id || "1"),
          priority_id:
            payload.priority_id ||
            (db.priorities?.[1]?.id || db.priorities?.[0]?.id || "2"),

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
  }, [session, db]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
