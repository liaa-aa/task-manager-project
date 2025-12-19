import React, { useMemo, useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Tasks() {
  const { db, createTask, updateTask, deleteTask } = useData();

  const [q, setQ] = useState("");
  const [statusId, setStatusId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // task object

  const statusMap = useMemo(() => new Map((db.statuses || []).map((s) => [s.id, s.name])), [db.statuses]);
  const priorityMap = useMemo(() => new Map((db.priorities || []).map((p) => [p.id, p.name])), [db.priorities]);
  const categoryMap = useMemo(() => new Map((db.categories || []).map((c) => [c.id, c.name])), [db.categories]);

  const doneStatusIds =
    db?.statuses?.filter((s) => (s.name || "").toLowerCase() === "done").map((s) => s.id) || [];

  const tasks = useMemo(() => {
    let items = [...(db.tasks || [])];

    // search
    const qq = q.trim().toLowerCase();
    if (qq) {
      items = items.filter((t) => {
        const hay = `${t.title || ""} ${t.description || ""}`.toLowerCase();
        return hay.includes(qq);
      });
    }

    // filters
    if (statusId) items = items.filter((t) => String(t.status_id) === String(statusId));
    if (priorityId) items = items.filter((t) => String(t.priority_id) === String(priorityId));
    if (categoryId) items = items.filter((t) => String(t.category_id) === String(categoryId));

    // sort
    items.sort((a, b) => {
      const da = a.updated_at || a.created_at || "";
      const dbb = b.updated_at || b.created_at || "";
      return sort === "newest" ? dbb.localeCompare(da) : da.localeCompare(dbb);
    });

    return items;
  }, [db.tasks, q, statusId, priorityId, categoryId, sort]);

  const onAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (task) => {
    setEditing(task);
    setOpen(true);
  };

  const onDelete = (task) => {
    const ok = confirm(`Hapus task: "${task.title}"?`);
    if (!ok) return;
    deleteTask(task.id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tasks</h1>
          <p className="text-sm text-primary/80">Kelola task kamu: buat, ubah, filter, dan rapikan.</p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-primary/80">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari berdasarkan title / description..."
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Status</label>
            <select
              value={statusId}
              onChange={(e) => setStatusId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            >
              <option value="">All</option>
              {(db.statuses || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Priority</label>
            <select
              value={priorityId}
              onChange={(e) => setPriorityId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            >
              <option value="">All</option>
              {(db.priorities || []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            >
              <option value="">All</option>
              {(db.categories || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-primary/70">
            Showing <span className="font-semibold text-primary">{tasks.length}</span> tasks
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-primary/80">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button
              onClick={() => {
                setQ("");
                setStatusId("");
                setPriorityId("");
                setCategoryId("");
                setSort("newest");
              }}
              className="rounded-xl border border-accent/70 bg-accent/20 px-3 py-2 text-sm font-semibold text-primary hover:bg-accent/30 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-accent/25">
              <tr className="text-primary">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Due</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-accent/40">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-primary/70">
                    Tidak ada task yang cocok. Klik <span className="font-semibold">Add Task</span> untuk membuat task baru.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => {
                  const statusName = statusMap.get(t.status_id) || "-";
                  const priorityName = priorityMap.get(t.priority_id) || "-";
                  const categoryName = categoryMap.get(t.category_id) || "-";

                  const isDone = doneStatusIds.includes(t.status_id);
                  const overdue = isOverdue(t.due_date, isDone);

                  return (
                    <tr
                      key={t.id}
                      className={[
                        "transition",
                        overdue ? "bg-red-50 hover:bg-red-100/60" : "hover:bg-accent/10",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-primary">{t.title}</div>
                          {overdue && <OverduePill />}
                        </div>

                        {t.description ? (
                          <div className="mt-1 text-xs text-primary/70 line-clamp-2">{t.description}</div>
                        ) : (
                          <div className="mt-1 text-xs text-primary/40">No description</div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge name={statusName} />
                      </td>

                      <td className="px-4 py-3">
                        <PriorityBadge name={priorityName} />
                      </td>

                      <td className="px-4 py-3">
                        <NeutralBadge>{categoryName}</NeutralBadge>
                      </td>

                      <td className="px-4 py-3 text-primary/80">
                        {t.due_date ? (
                          <span className={overdue ? "font-semibold text-red-700" : ""}>{t.due_date}</span>
                        ) : (
                          <span className="text-primary/40">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => onEdit(t)}
                            className="rounded-lg border border-accent/70 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent/25 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(t)}
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <TaskModal
          db={db}
          initial={editing}
          onClose={() => setOpen(false)}
          onSubmit={(payload) => {
            if (editing) updateTask(editing.id, payload);
            else createTask(payload);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

/* ----------------- helpers ----------------- */

function isOverdue(dueDateStr, isDone) {
  if (!dueDateStr) return false;
  if (isDone) return false;

  // due date from <input type="date"> = "YYYY-MM-DD"
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  return dueDateStr < todayStr;
}

/* ----------------- badges ----------------- */

function NeutralBadge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {children}
    </span>
  );
}

function StatusBadge({ name }) {
  const n = (name || "").toLowerCase();

  // Mapping style by status name
  if (n.includes("done")) {
    return (
      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        {name}
      </span>
    );
  }
  if (n.includes("doing") || n.includes("in progress")) {
    return (
      <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
        {name}
      </span>
    );
  }
  // default Todo / others
  return (
    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {name}
    </span>
  );
}

function PriorityBadge({ name }) {
  const n = (name || "").toLowerCase();

  if (n.includes("high")) {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
        {name}
      </span>
    );
  }
  if (n.includes("medium")) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
        {name}
      </span>
    );
  }
  // default Low / others
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
      {name}
    </span>
  );
}

function OverduePill() {
  return (
    <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">
      Overdue
    </span>
  );
}

/* ----------------- modal ----------------- */

function TaskModal({ db, initial, onClose, onSubmit }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [dueDate, setDueDate] = useState(initial?.due_date || "");
  const [statusId, setStatusId] = useState(String(initial?.status_id || db.statuses?.[0]?.id || ""));
  const [priorityId, setPriorityId] = useState(String(initial?.priority_id || db.priorities?.[0]?.id || ""));
  const [categoryId, setCategoryId] = useState(initial?.category_id ? String(initial.category_id) : "");

  const isEdit = Boolean(initial);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description,
      due_date: dueDate,
      status_id: statusId,
      priority_id: priorityId,
      category_id: categoryId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button onClick={onClose} className="absolute inset-0 bg-black/30" aria-label="Close" />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-accent/60 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-primary">{isEdit ? "Edit Task" : "Add Task"}</h2>
            <p className="text-sm text-primary/70">Isi data task dengan lengkap dan rapi.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-accent/70 bg-accent/15 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-accent/25 transition"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-primary/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Belajar React Router"
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="(Optional) Tambahkan detail task..."
              rows={3}
              className="mt-1 w-full resize-none rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-primary/80">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {(db.statuses || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Priority</label>
              <select
                value={priorityId}
                onChange={(e) => setPriorityId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {(db.priorities || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                <option value="">None</option>
                {(db.categories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-primary/80">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                {isEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
