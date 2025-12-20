import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function HomePrivate() {
  const { user, tasksForUser, categoriesForUser, statuses, priorities } = useApp();

  const tasks = tasksForUser?.(user?.id) || [];
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

  const grouped = useMemo(() => {
    const map = new Map();
    for (const t of tasks) {
      const key = t.category_id ? String(t.category_id) : "uncat";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return map;
  }, [tasks]);

  const totalTasks = tasks.length;
  const totalCategories = categories.length;
  const uncategorized = (grouped.get("uncat") || []).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Top */}
      <section className="rounded-3xl border border-primary/10 bg-base p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-primary/70">Welcome back,</div>
            <h1 className="text-2xl font-black text-primary sm:text-3xl">
              {user?.name || "User"}
            </h1>
            <p className="mt-1 text-sm text-primary/75">
              Berikut daftar task kamu yang dikelompokkan berdasarkan kategori.
            </p>
          </div>

          <Link
            to="/add"
            className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition sm:w-auto"
          >
            + Add New
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Total Task" value={totalTasks} />
          <StatCard label="Categories" value={totalCategories} />
          <StatCard label="Uncategorized" value={uncategorized} />
        </div>
      </section>

      {/* Groups */}
      <section className="mt-6 grid gap-4">
        {[...grouped.entries()].map(([catId, list]) => {
          const title = catId === "uncat" ? "Uncategorized" : categoryNameById.get(catId) || "Category";
          return (
            <div
              key={catId}
              className="rounded-3xl border border-primary/10 bg-white/70 p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-extrabold text-primary sm:text-lg">
                  {title}
                </div>
                <div className="text-xs font-semibold text-primary/60">
                  {list.length} task
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {list.length === 0 ? (
                  <div className="rounded-2xl border border-primary/10 bg-white/60 p-4 text-sm text-primary/70">
                    Belum ada task di kategori ini.
                  </div>
                ) : (
                  list.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      categoryName={title}
                      statusName={statusNameById.get(String(t.status_id)) || "Todo"}
                      priorityName={priorityNameById.get(String(t.priority_id)) || "Medium"}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-2xl font-black text-primary">{value}</div>
    </div>
  );
}

function TaskCard({ task, statusName, priorityName, categoryName }) {
  return (
    <div className="rounded-3xl border border-primary/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="truncate text-base font-extrabold text-primary sm:text-lg">
            {task.title}
          </div>
          <div className="mt-1 text-xs text-primary/70">
            Deadline {task.due_date || "-"} • Priority {priorityName} • Status {statusName}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Pill>{statusName}</Pill>
            <Pill>{priorityName}</Pill>
            <Pill>Due: {task.due_date || "-"}</Pill>
            <Pill>{categoryName}</Pill>
          </div>

          {task.description ? (
            <p className="mt-3 text-sm text-primary/75">{task.description}</p>
          ) : null}
        </div>

        <div className="flex w-full gap-2 sm:w-auto sm:flex-col sm:items-end">
          <Link
            to={`/task/${task.id}`}
            className="inline-flex w-full items-center justify-center rounded-xl border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary hover:bg-white transition sm:w-auto"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-1 font-semibold text-primary">
      {children}
    </span>
  );
}
