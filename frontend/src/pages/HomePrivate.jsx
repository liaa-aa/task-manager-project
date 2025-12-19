import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function HomePrivate() {
  const {
    user,
    tasksForUser,
    deleteTask,
    statuses,
    priorities,
    categoriesForUser,
  } = useApp();

  const tasks = tasksForUser(user.id);
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

  const grouped = useMemo(() => {
    const map = new Map(); // categoryId -> tasks[]
    for (const c of categories) map.set(String(c.id), []);
    map.set("", []); // Uncategorized

    for (const t of tasks) {
      const key = t.category_id ? String(t.category_id) : "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return map;
  }, [categories, tasks]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold text-primary/60">
            Welcome back,
          </div>
          <h1 className="text-2xl font-black tracking-tight text-primary">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-primary/75">
            Berikut daftar task kamu yang dikelompokkan berdasarkan kategori.
          </p>
        </div>

        <Link
          to="/add"
          className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
        >
          + Add New
        </Link>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Task" value={String(tasks.length)} />
        <StatCard label="Categories" value={String(categories.length)} />
        <StatCard
          label="Uncategorized"
          value={String((grouped.get("") || []).length)}
        />
      </section>

      <section className="mt-8 space-y-6">
        {categories.map((c) => (
          <CategoryBlock
            key={c.id}
            title={c.name}
            tasks={grouped.get(String(c.id)) || []}
            statusNameById={statusNameById}
            priorityNameById={priorityNameById}
            categoryNameById={categoryNameById}
            onDelete={deleteTask}
          />
        ))}

        <CategoryBlock
          title="Uncategorized"
          tasks={grouped.get("") || []}
          statusNameById={statusNameById}
          priorityNameById={priorityNameById}
          categoryNameById={categoryNameById}
          onDelete={deleteTask}
          muted
        />
      </section>

      {tasks.length === 0 ? (
        <section className="mt-10">
          <div className="rounded-3xl border border-primary/15 bg-white/60 p-8 text-center">
            <div className="text-lg font-extrabold text-primary">
              Belum ada task
            </div>
            <p className="mt-2 text-sm text-primary/70">
              Mulai dengan membuat task pertama kamu.
            </p>
            <Link
              to="/add"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Create your first task
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function CategoryBlock({
  title,
  tasks,
  statusNameById,
  priorityNameById,
  categoryNameById,
  onDelete,
  muted,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-primary/15 bg-white/60 shadow-sm">
      <div className={`px-5 py-4 ${muted ? "bg-secondary/10" : "bg-secondary/15"}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-primary">{title}</div>
          <div className="text-xs font-semibold text-primary/60">
            {tasks.length} task
          </div>
        </div>
      </div>

      <div className="p-5">
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-primary/10 bg-white/70 p-6 text-center">
            <div className="text-sm font-bold text-primary">Kosong</div>
            <div className="mt-1 text-xs text-primary/60">
              Tidak ada task di kategori ini.
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                statusNameById={statusNameById}
                priorityNameById={priorityNameById}
                categoryNameById={categoryNameById}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  statusNameById,
  priorityNameById,
  categoryNameById,
  onDelete,
}) {
  const statusName = statusNameById.get(String(task.status_id)) || "Todo";
  const priorityName = priorityNameById.get(String(task.priority_id)) || "Medium";
  const categoryName = task.category_id
    ? categoryNameById.get(String(task.category_id)) || "Category"
    : "Uncategorized";

  const dueLabel = task.due_date ? task.due_date : "-";
  const navigate = useNavigate();


  return (
    <div className="rounded-3xl border border-primary/15 bg-white/70 p-5 hover:bg-white/80 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-extrabold text-primary">
            {task.title}
          </div>
          <div className="mt-1 text-xs text-primary/70">
            Deadline {dueLabel} • Priority {priorityName} • Status {statusName}
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge>{statusName}</Badge>
            <Badge>{priorityName}</Badge>
            <Badge>Due: {dueLabel}</Badge>
            <Badge>{categoryName}</Badge>
          </div>

          {task.description ? (
            <p className="mt-3 line-clamp-2 text-sm text-primary/75">
              {task.description}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => navigate(`/tasks/${task.id}`)}
        className="rounded-xl border border-primary/15 bg-white/70 px-3 py-2 text-xs font-bold text-primary hover:bg-white transition"
      >
        Detail
      </button>

      <button
        type="button"
        onClick={() => {
          if (confirm(`Hapus task: "${task.title}"?`)) onDelete(task.id);
          }}
        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
      >
        Delete
      </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-0.5 font-semibold text-primary">
      {children}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white/60 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-lg font-black text-primary">{value}</div>
    </div>
  );
}
