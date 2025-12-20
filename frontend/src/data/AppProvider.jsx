import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AppContext = createContext(null);

const LS_SESSION = "tm_session";
const LS_LOCAL = "tm_local"; // untuk cache local: categories, statuses, priorities (kalau belum ada endpoint)

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

function seedLocalIfEmpty() {
  const v = loadJSON(LS_LOCAL, null);
  if (v) return;

  saveJSON(LS_LOCAL, {
    categories: [], // local sementara (per user)
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
  });
}

export function AppProvider({ children }) {
  useEffect(() => seedLocalIfEmpty(), []);

  const [session, setSession] = useState(() => loadJSON(LS_SESSION, null));
  const [local, setLocal] = useState(() =>
    loadJSON(LS_LOCAL, { categories: [], statuses: [], priorities: [] })
  );

  // cache tasks dari BE biar UI ringan
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);

  useEffect(() => saveJSON(LS_SESSION, session), [session]);
  useEffect(() => saveJSON(LS_LOCAL, local), [local]);

  // ========== FETCH TASKS dari BE setelah login ==========
  useEffect(() => {
    let ignore = false;

    async function run() {
      if (!session?.token) {
        setTasks([]);
        setTasksLoaded(false);
        return;
      }

      try {
        const res = await api.get("/task"); // <-- penting: /task (singular)
        if (ignore) return;

        // asumsi response bisa array langsung atau {data: [...]}
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setTasks(data);
        setTasksLoaded(true);
      } catch {
        // jangan spam error; cukup mark belum loaded
        if (ignore) return;
        setTasks([]);
        setTasksLoaded(true);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [session?.token]);

  const value = useMemo(() => {
    const statuses = local.statuses || [];
    const priorities = local.priorities || [];

    return {
      // ================= AUTH (BE) =================
      session,
      user: session?.user || null,

      async register({ name, email, password }) {
        // BE: POST /register
        await api.post("/register", { name, email, password });

        // auto login
        const res = await api.post("/login", { email, password });
        setSession({ token: res.data.token, user: res.data.user });
      },

      async login({ email, password }) {
        const res = await api.post("/login", { email, password });
        setSession({ token: res.data.token, user: res.data.user });
      },

      logout() {
        setSession(null);
        setTasks([]);
        setTasksLoaded(false);
      },

      // ================= MASTER DATA (sementara local) =================
      statuses,
      priorities,

      categoriesForUser(userId) {
        return (local.categories || []).filter((c) => c.user_id === userId);
      },

      addCategory(userId, name) {
        const v = (name || "").trim();
        if (!v) throw new Error("Category kosong.");

        const exists = (local.categories || []).find(
          (c) => c.user_id === userId && (c.name || "").toLowerCase() === v.toLowerCase()
        );
        if (exists) return exists.id;

        const newCat = {
          id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
          user_id: userId,
          name: v,
          created_at: new Date().toISOString(),
        };

        setLocal((prev) => ({ ...prev, categories: [newCat, ...(prev.categories || [])] }));
        return newCat.id;
      },

      // ================= TASKS (BE: /task) =================
      tasks,
      tasksLoaded,

      async refreshTasks() {
        if (!session?.token) return;
        const res = await api.get("/task");
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setTasks(data);
        setTasksLoaded(true);
      },

      async getTaskById(id) {
        const res = await api.get(`/task/${id}`);
        return res.data;
      },

      // Create task: kirim payload sesuai model BE
      // BE model: title, description, category_id, status_id, priority_id, due_date
      // Opsional: category_name (kalau BE kamu handle create category by name)
      async createTask(payload) {
        const body = {
          title: (payload.title || "").trim(),
          description: payload.description?.trim() || "",
          category_id: payload.category_id || null,
          status_id: Number(payload.status_id || 1),
          priority_id: Number(payload.priority_id || 2),
          due_date: payload.due_date || null,
        };

        // kalau user bikin kategori baru, bisa kirim category_name juga (aman walau BE belum pakai)
        if (payload.category_name) body.category_name = payload.category_name.trim();

        await api.post("/task", body);
        await this.refreshTasks();
      },

      async updateTask(id, payload) {
        const body = {
          title: (payload.title || "").trim(),
          description: payload.description?.trim() || "",
          category_id: payload.category_id || null,
          status_id: Number(payload.status_id || 1),
          priority_id: Number(payload.priority_id || 2),
          due_date: payload.due_date || null,
        };
        if (payload.category_name) body.category_name = payload.category_name.trim();

        await api.put(`/task/${id}`, body);
        await this.refreshTasks();
      },

      async deleteTask(id) {
        await api.delete(`/task/${id}`);
        await this.refreshTasks();
      },
    };
  }, [session, local, tasks, tasksLoaded]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
