import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user, tasksForUser, categoriesForUser, statuses, priorities } = useApp();

  const tasks = tasksForUser?.(user?.id) || [];
  const task = tasks.find((t) => String(t.id) === String(id));

  const categories = categoriesForUser?.(user?.id) || [];

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
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-3xl border border-primary/10 bg-white/70 p-6">
          <h1 className="text-xl font-black text-primary">Task not found</h1>
          <p className="mt-2 text-sm text-primary/70">
            Task dengan ID ini tidak ditemukan.
          </p>

          <div className="mt-4">
            <button
              onClick={() => navigate("/home")}
              className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  const statusName = statusNameById.get(String(task.status_id)) || "Todo";
  const priorityName = priorityNameById.get(String(task.priority_id)) || "Medium";
  const categoryName = task.category_id
    ? categoryNameById.get(String(task.category_id)) || "Category"
    : "Uncategorized";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-primary sm:text-2xl">Task Detail</h1>
          <p className="mt-1 text-sm text-primary/70">
            Detail task milikmu, format konsisten dengan card di Home.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/home"
            className="inline-flex w-full items-center justify-center rounded-xl border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary hover:bg-white transition sm:w-auto"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-primary/10 bg-white/70 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold text-primary sm:text-2xl">
              {task.title}
            </h2>

            <div className="mt-2 text-xs text-primary/70">
              Deadline {task.due_date || "-"} • Priority {priorityName} • Status {statusName}
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Pill>{statusName}</Pill>
              <Pill>{priorityName}</Pill>
              <Pill>Due: {task.due_date || "-"}</Pill>
              <Pill>{categoryName}</Pill>
            </div>
          </div>

          <div className="flex gap-2 sm:flex-col sm:items-end">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition sm:w-auto"
            >
              Done
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-primary/10 bg-white/70 p-4">
          <div className="text-xs font-semibold text-primary/60">Description</div>
          <p className="mt-2 text-sm text-primary/80">
            {task.description ? task.description : "(No description)"}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <InfoCard label="Category" value={categoryName} />
          <InfoCard label="Status" value={statusName} />
          <InfoCard label="Priority" value={priorityName} />
        </div>
      </div>
    </main>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-1 font-semibold text-primary">
      {children}
    </span>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-sm font-black text-primary">{value}</div>
    </div>
  );
}
