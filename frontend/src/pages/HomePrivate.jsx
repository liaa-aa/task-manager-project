import { useMemo, useState } from "react";
import { useApp } from "../data/AppProvider.jsx";

export default function HomePrivate() {
  const { user, categories, tasksForUser, addTask, deleteTask } = useApp();
  const tasks = tasksForUser(user.id);

  const [showForm, setShowForm] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map(); // categoryId -> tasks[]
    for (const c of categories) map.set(c.id, []);
    map.set("", []); // uncategorized

    for (const t of tasks) {
      const key = t.category_id || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return map;
  }, [categories, tasks]);

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Home</h1>
          <p className="text-sm text-primary/80">
            Task milik <span className="font-semibold">{user.name}</span> dikelompokkan per kategori.
          </p>
        </div>

        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          {showForm ? "Close Form" : "+ Add New"}
        </button>
      </div>

      {/* Add form (inline, bukan modal) */}
      {showForm ? (
        <AddTaskInline
          categories={categories}
          onAdd={(payload) => {
            addTask(user.id, payload);
            setShowForm(false);
          }}
        />
      ) : null}

      {/* Grouped list */}
      <div className="mt-4 space-y-4">
        {categories.map((c) => (
          <CategorySection
            key={c.id}
            title={c.name}
            tasks={grouped.get(c.id) || []}
            onDelete={deleteTask}
          />
        ))}

        <CategorySection
          title="Uncategorized"
          tasks={grouped.get("") || []}
          onDelete={deleteTask}
          muted
        />
      </div>
    </div>
  );
}

function AddTaskInline({ categories, onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [dueDate, setDueDate] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId,
      due_date: dueDate,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <div className="rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
      <div className="text-sm font-semibold text-primary">Add New Task</div>
      <p className="mt-1 text-xs text-primary/70">Isi form lalu simpan.</p>

      <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-primary/80">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            placeholder="Contoh: Kerjakan tugas kampus"
            autoFocus
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-primary/80">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full resize-none rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            rows={3}
            placeholder="(Optional) detail task..."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-primary/80">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="">Uncategorized</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-primary/80">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function CategorySection({ title, tasks, onDelete, muted }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
      <div className={`px-4 py-3 ${muted ? "bg-accent/10" : "bg-accent/25"}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-primary">{title}</div>
          <div className="text-xs text-primary/70">
            {tasks.length} task
          </div>
        </div>
      </div>

      <div className="divide-y divide-accent/40">
        {tasks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-primary/70">
            Tidak ada task di kategori ini.
          </div>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-accent/10 transition">
              <div className="min-w-0">
                <div className="font-semibold text-primary truncate">{t.title}</div>
                {t.description ? (
                  <div className="mt-1 text-xs text-primary/70 line-clamp-2">{t.description}</div>
                ) : (
                  <div className="mt-1 text-xs text-primary/40">No description</div>
                )}
                <div className="mt-2 text-xs text-primary/70">
                  Due: <span className="font-semibold">{t.due_date || "-"}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm(`Hapus task: "${t.title}"?`)) onDelete(t.id);
                }}
                className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
