import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

function formatDate(d) {
  if (!d) return "-";
  // kalau dari BE berupa "2026-01-10" / ISO string, ambil 10 char pertama
  const s = String(d);
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function findNameById(list, id, fallback = "-") {
  const x = (list || []).find((i) => String(i.id) === String(id));
  return x?.name || fallback;
}

function badgeClass(kind) {
  // biar badge beda warna dikit tapi tetap elegan
  if (kind === "status") return "border-primary/15 bg-white/70 text-primary";
  if (kind === "priority") return "border-accent/40 bg-accent/10 text-primary";
  if (kind === "due") return "border-secondary/25 bg-secondary/10 text-primary";
  if (kind === "cat") return "border-primary/15 bg-white/70 text-primary";
  return "border-primary/15 bg-white/70 text-primary";
}

function Badge({ kind = "default", children }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        badgeClass(kind),
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 shadow-sm">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-2xl font-black text-primary">{value}</div>
    </div>
  );
}

function TaskCard({ task, statusName, priorityName, categoryName, onDelete }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-extrabold text-primary">
            {task.title || "(untitled)"}
          </div>

          <div className="mt-1 text-xs text-primary/70">
            Deadline {formatDate(task.due_date)} • Priority {priorityName} • Status{" "}
            {statusName}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge kind="status">{statusName}</Badge>
            <Badge kind="priority">{priorityName}</Badge>
            <Badge kind="due">Due: {formatDate(task.due_date)}</Badge>
            <Badge kind="cat">{categoryName || "Uncategorized"}</Badge>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <Link
            to={`/task/${task.id}`}
            className="rounded-xl border border-primary/15 bg-white/70 px-4 py-2 text-xs font-bold text-primary hover:bg-white transition"
          >
            Detail
          </Link>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description ? (
        <p className="mt-3 line-clamp-2 text-sm text-primary/80">{task.description}</p>
      ) : null}
    </div>
  );
}

export default function HomePrivate() {
  const {
    user,
    tasks,
    tasksLoaded,
    deleteTask,
    statuses,
    priorities,
    categoriesForUser,
  } = useApp();

  // category local (sementara) untuk user ini
  const categories = categoriesForUser(user.id);

  const categoryNameById = useMemo(() => {
    const m = new Map();
    (categories || []).forEach((c) => m.set(String(c.id), c.name));
    return m;
  }, [categories]);

  // GROUP tasks by category_id
  const grouped = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];

    // filter task milik user (kalau BE sudah scoped by token, ini aman; tapi tetap amanin)
    const owned = list.filter((t) => String(t.user_id || "") === String(user.id || "") || !t.user_id);

    const map = new Map();
    for (const t of owned) {
      const key = t.category_id ? String(t.category_id) : "__uncat__";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }

    // urutkan task terbaru dulu (kalau ada created_at)
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));
      map.set(k, arr);
    }

    // urutkan group: kategori dulu, uncategorized terakhir
    const keys = Array.from(map.keys()).sort((a, b) => {
      if (a === "__uncat__") return 1;
      if (b === "__uncat__") return -1;
      const an = categoryNameById.get(a) || "";
      const bn = categoryNameById.get(b) || "";
      return an.localeCompare(bn);
    });

    return keys.map((k) => ({
      key: k,
      name: k === "__uncat__" ? "Uncategorized" : categoryNameById.get(k) || "Category",
      items: map.get(k) || [],
    }));
  }, [tasks, user.id, categoryNameById]);

  const totalTasks = useMemo(() => (Array.isArray(tasks) ? tasks.length : 0), [tasks]);
  const totalCategories = useMemo(() => (categories || []).length, [categories]);

  const uncatCount = useMemo(() => {
    const list = Array.isArray(tasks) ? tasks : [];
    return list.filter((t) => !t.category_id).length;
  }, [tasks]);

  const onDelete = async (id) => {
    // simple confirm biar tidak kepencet
    const ok = confirm("Yakin hapus task ini?");
    if (!ok) return;

    try {
      await deleteTask(id);
    } catch (e) {
      alert(e?.message || "Gagal delete task");
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      {/* Header */}
      <section className="rounded-3xl border border-primary/10 bg-white/60 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-primary/60">Welcome back,</div>
            <div className="text-2xl font-black text-primary">{user?.name || "User"}</div>
            <p className="mt-1 text-sm text-primary/75">
              Berikut daftar task kamu yang dikelompokkan berdasarkan kategori.
            </p>
          </div>

          <Link
            to="/add"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-extrabold text-white hover:opacity-90 transition"
          >
            + Add New
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatBox label="Total Task" value={totalTasks} />
          <StatBox label="Categories" value={totalCategories} />
          <StatBox label="Uncategorized" value={uncatCount} />
        </div>
      </section>

      {/* Body */}
      <section className="mt-8 space-y-6">
        {!tasksLoaded ? (
          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6 text-sm text-primary/70">
            Loading tasks...
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-2xl border border-primary/10 bg-white/60 p-6">
            <div className="text-lg font-extrabold text-primary">Belum ada task</div>
            <p className="mt-1 text-sm text-primary/75">
              Klik <span className="font-bold">+ Add New</span> untuk membuat task pertama kamu.
            </p>
          </div>
        ) : (
          grouped.map((g) => (
            <div
              key={g.key}
              className="overflow-hidden rounded-3xl border border-primary/10 bg-white/60 shadow-sm"
            >
              <div className="flex items-center justify-between bg-secondary/10 px-6 py-4">
                <div className="text-base font-extrabold text-primary">{g.name}</div>
                <div className="text-xs font-semibold text-primary/60">
                  {g.items.length} task
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {g.items.map((t) => {
                    const statusName = findNameById(statuses, t.status_id, "Todo");
                    const priorityName = findNameById(priorities, t.priority_id, "Medium");
                    const categoryName =
                      g.key === "__uncat__" ? "Uncategorized" : g.name;

                    return (
                      <TaskCard
                        key={t.id}
                        task={t}
                        statusName={statusName}
                        priorityName={priorityName}
                        categoryName={categoryName}
                        onDelete={onDelete}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
