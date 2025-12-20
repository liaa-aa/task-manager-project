import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession } from "../lib/api.js";
import { getTasksApi, deleteTaskApi } from "../lib/taskApi.js";

export default function HomePrivate() {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

  const [tasks, setTasks] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  function normalizeTasks(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.tasks)) return data.tasks;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }

  async function load() {
    setLoading(true);
    setErrMsg("");
    try {
      const data = await getTasksApi();
      setTasks(normalizeTasks(data));
    } catch (err) {
      setTasks([]);
      setErrMsg(err.normalizedMessage || "Gagal memuat tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const total = Array.isArray(tasks) ? tasks.length : 0;
    const done = (Array.isArray(tasks) ? tasks : []).filter(
      (t) =>
        String(t?.status_name || "").toLowerCase() === "done" ||
        String(t?.status || "").toLowerCase() === "done" ||
        Number(t?.status_id) === 3
    ).length;

    const categorySet = new Set(
      (Array.isArray(tasks) ? tasks : [])
        .map((t) => t?.category_name || t?.category || "")
        .filter(Boolean)
    );

    return { total, done, categories: categorySet.size };
  }, [tasks]);

  async function onDelete(id) {
    if (!id) return;
    try {
      await deleteTaskApi(id);
      await load();
    } catch (err) {
      setErrMsg(err.normalizedMessage || "Gagal menghapus task.");
    }
  }

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-primary/70">Welcome,</div>
          <h1 className="text-3xl font-black text-primary">{user?.name || "User"}</h1>
          <p className="mt-2 text-sm text-primary/70">
            Berikut daftar task kamu.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/add"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition"
          >
            + Add New
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Tasks" value={stats.total} />
        <StatCard label="Done" value={stats.done} />
        <StatCard label="Categories" value={stats.categories} />
      </section>

      {errMsg ? (
        <div className="mt-6 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-4 text-sm font-semibold text-primary">
          {errMsg}
        </div>
      ) : null}

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-primary">Your Tasks</h2>
          <button
            type="button"
            onClick={load}
            className="rounded-xl border border-primary/15 bg-white/60 px-4 py-2 text-sm font-bold text-primary hover:bg-white transition"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-4 rounded-2xl border border-primary/15 bg-white/60 p-5 text-sm text-primary/70">
            Loading tasks...
          </div>
        ) : null}

        {!loading && (!tasks || tasks.length === 0) ? (
          <div className="mt-4 rounded-2xl border border-primary/15 bg-white/60 p-6">
            <div className="text-lg font-bold text-primary">Belum ada task</div>
            <Link
              to="/add"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Create Task
            </Link>
          </div>
        ) : null}

        {!loading && Array.isArray(tasks) && tasks.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {tasks.map((t) => (
              <TaskCard key={t.id || `${t.title}-${t.created_at}`} task={t} onDelete={onDelete} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white/60 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-2xl font-black text-primary">{value}</div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-0.5 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function TaskCard({ task, onDelete }) {
  const title = task?.title || "(untitled)";
  const desc = task?.description || "";

  const status =
    task?.status_name ||
    task?.status ||
    (Number(task?.status_id) === 1 ? "Todo" : Number(task?.status_id) === 2 ? "Doing" : "Done");

  const priority =
    task?.priority_name ||
    task?.priority ||
    (Number(task?.priority_id) === 1 ? "Low" : Number(task?.priority_id) === 2 ? "Medium" : "High");

  const dueRaw = task?.due_date || "";
  const due = formatDate(dueRaw);

  const category = task?.category_name || task?.category || "";

  return (
    <div className="rounded-3xl border border-primary/15 bg-white/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-extrabold text-primary">{title}</div>
          <div className="mt-1 text-xs text-primary/70">
            {due ? `Deadline ${due} • ` : ""}
            Priority {priority} • Status {status}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{status}</Badge>
            <Badge>{priority}</Badge>
            {due ? <Badge>Due: {due}</Badge> : null}
            {category ? <Badge>{category}</Badge> : <Badge>Uncategorized</Badge>}
          </div>

          {desc ? (
            <p className="mt-3 text-sm leading-relaxed text-primary/75">{desc}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to={`/task/${task?.id}`}
            className="rounded-xl border border-primary/15 bg-white/70 px-3 py-2 text-xs font-bold text-primary hover:bg-white transition text-center"
          >
            Detail
          </Link>

          <button
            type="button"
            onClick={() => onDelete(task?.id)}
            className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs font-bold text-primary hover:bg-accent/15 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

