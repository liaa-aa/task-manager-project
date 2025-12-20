import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTaskApi } from "../lib/taskApi.js";
import { listCategoriesApi } from "../lib/categoryApi.js";
import { getSession } from "../lib/api.js";

const STATUSES = [
  { id: 1, name: "Todo" },
  { id: 2, name: "Doing" },
  { id: 3, name: "Done" },
];

const PRIORITIES = [
  { id: 1, name: "Low" },
  { id: 2, name: "Medium" },
  { id: 3, name: "High" },
];

export default function AddTask() {
  const navigate = useNavigate();
  const session = getSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [statusId, setStatusId] = useState(1);
  const [priorityId, setPriorityId] = useState(1);

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadCategories() {
      try {
        const data = await listCategoriesApi();
        if (!alive) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch {

      }
    }

    loadCategories();
    return () => {
      alive = false;
    };
  }, []);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setErr("");

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        due_date: dueDate || null,
        status_id: Number(statusId),
        priority_id: Number(priorityId),
      };

      const nc = newCategory.trim();
      if (nc) {
        payload.category_name = nc; 
      } else if (categoryId) {
        payload.category_id = categoryId; 
      }

      await createTaskApi(payload);
      navigate("/home");
    } catch (e2) {
      setErr(e2?.normalizedMessage || "Gagal membuat task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
        <h1 className="text-2xl font-extrabold text-primary">Add Task</h1>
        <p className="mt-1 text-sm text-primary/70">
          Login sebagai <b>{session?.user?.name || "User"}</b>
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-primary/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="Contoh: Kerjakan laporan"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              rows={4}
              placeholder="(optional)"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-primary/80">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Category</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (e.target.value) setNewCategory("");
                }}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                disabled={newCategory.trim().length > 0}
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-primary/60">
                Pilih kategori yang sudah ada, atau buat baru di bawah.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-primary/80">New Category (Optional)</label>
              <input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  if (e.target.value.trim().length > 0) setCategoryId("");
                }}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="Contoh: Finance"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {STATUSES.map((s) => (
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
                onChange={(e) => setPriorityId(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
                canSubmit && !loading
                  ? "bg-secondary hover:opacity-90"
                  : "bg-secondary/50 cursor-not-allowed",
              ].join(" ")}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
