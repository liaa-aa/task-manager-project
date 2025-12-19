import { Link, useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useApp } from "../data/AppProvider.jsx";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    getTaskForUserById,
    deleteTask,
    statuses,
    priorities,
    categoriesForUser,
  } = useApp();

  const task = getTaskForUserById(user.id, id);
  const categories = categoriesForUser(user.id);

  const statusNameById = useMemo(() => {
    const m = new Map();
    (statuses || []).forEach((s) => m.set(String(s.id), s.name));
    return m;
  }, [statuses]);

  const priorityNameById = useMemo(() => {
    const m = new Map();
    (priorities || []).forEach((p) => m.set(String(p.id), p.name));
    return m;
  }, [priorities]);

  const categoryNameById = useMemo(() => {
    const m = new Map();
    (categories || []).forEach((c) => m.set(String(c.id), c.name));
    return m;
  }, [categories]);

  if (!task) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="rounded-3xl border border-primary/15 bg-white/60 p-8">
          <div className="text-lg font-extrabold text-primary">Task tidak ditemukan</div>
          <p className="mt-2 text-sm text-primary/70">
            Task ini mungkin sudah dihapus atau bukan milik akunmu.
          </p>
          <Link
            to="/home"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const statusName = statusNameById.get(String(task.status_id)) || "Todo";
  const priorityName = priorityNameById.get(String(task.priority_id)) || "Medium";
  const categoryName = task.category_id
    ? categoryNameById.get(String(task.category_id)) || "Category"
    : "Uncategorized";

  const dueLabel = task.due_date || "-";

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <Link
          to="/home"
          className="rounded-xl border border-primary/15 bg-white/60 px-4 py-2 text-sm font-bold text-primary hover:bg-white/80 transition"
        >
          ← Back
        </Link>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/add")}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
          >
            + Add New
          </button>

          <button
            onClick={() => {
              if (confirm(`Hapus task: "${task.title}"?`)) {
                deleteTask(task.id);
                navigate("/home", { replace: true });
              }
            }}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <section className="mt-6 rounded-3xl border border-primary/15 bg-white/60 p-6">
        <div className="text-xs font-semibold text-primary/60">Task Detail</div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-primary">
          {task.title}
        </h1>

        <div className="mt-2 text-sm text-primary/70">
          Deadline {dueLabel} • Priority {priorityName} • Status {statusName}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <Badge>{statusName}</Badge>
          <Badge>{priorityName}</Badge>
          <Badge>Due: {dueLabel}</Badge>
          <Badge>{categoryName}</Badge>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info label="Created at" value={task.created_at ? new Date(task.created_at).toLocaleString() : "-"} />
          <Info label="Task ID" value={String(task.id)} />
        </div>

        <div className="mt-6">
          <div className="text-xs font-semibold text-primary/60">Description</div>
          <div className="mt-2 rounded-2xl border border-primary/10 bg-white/70 p-4 text-sm text-primary/80">
            {task.description ? task.description : <span className="text-primary/50">No description</span>}
          </div>
        </div>
      </section>
    </main>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-0.5 font-semibold text-primary">
      {children}
    </span>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white/70 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-sm font-bold text-primary">{value}</div>
    </div>
  );
}
