import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTaskByIdApi, updateTaskApi } from "../lib/taskApi.js";
import { listCategoriesApi, deleteCategoryApi } from "../lib/categoryApi.js";
import CategoryDropdown from "../components/CategoryDropdown.jsx";

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

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority_id: 1,
    status_id: 1,
    category_id: "",
    new_category: "",
  });

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      setLoading(true);
      setError("");

      try {
        const [task, cats] = await Promise.all([
          getTaskByIdApi(id),
          listCategoriesApi().catch(() => []),
        ]);

        if (!alive) return;

        setCategories(Array.isArray(cats) ? cats : []);

        setForm({
          title: task?.title || "",
          description: task?.description || "",
          due_date: task?.due_date ? task.due_date.split("T")[0] : "",
          priority_id: task?.priority_id || 1,
          status_id: task?.status_id || 1,
          category_id: task?.category_id || "",
          new_category: "",
        });
      } catch (e) {
        if (!alive) return;
        setError(e?.normalizedMessage || "Gagal memuat data task.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadAll();
    return () => {
      alive = false;
    };
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() ? form.description.trim() : null,
        due_date: form.due_date || null,
        priority_id: Number(form.priority_id),
        status_id: Number(form.status_id),
      };

      const nc = form.new_category.trim();
      if (nc) {
        payload.category_name = nc;
      } else if (form.category_id) {
        payload.category_id = form.category_id;
      } else {
        payload.category_id = null;
      }

      await updateTaskApi(id, payload);
      navigate(`/task/${id}`);
    } catch (e2) {
      setError(e2?.normalizedMessage || "Gagal mengupdate task.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-primary">Edit Task</h1>
        <Link
          to={`/task/${id}`}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold hover:bg-black/5"
        >
          Back
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-primary/80">Title</label>
            <input
              type="text"
              name="title"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              value={form.title}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Description</label>
            <textarea
              name="description"
              rows={4}
              className="mt-1 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              value={form.description}
              onChange={onChange}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-primary/80">Due Date</label>
              <input
                type="date"
                name="due_date"
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                value={form.due_date}
                onChange={onChange}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Category</label>
              <CategoryDropdown
                categories={categories}
                value={form.category_id}
                disabled={form.new_category.trim().length > 0}
                onSelect={(nextId) => {
                  setForm((s) => ({
                    ...s,
                    category_id: nextId,
                    new_category: nextId ? "" : s.new_category,
                  }));
                }}
                onDelete={async (deleteId) => {
                  try {
                    await deleteCategoryApi(deleteId);

                    setCategories((curr) =>
                      (Array.isArray(curr) ? curr : []).filter(
                        (c) => String(c.id) !== String(deleteId)
                      )
                    );

                    setForm((s) => ({
                      ...s,
                      category_id:
                        String(s.category_id) === String(deleteId)
                          ? ""
                          : s.category_id,
                    }));
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-primary/80">
                New Category (optional)
              </label>
              <input
                type="text"
                name="new_category"
                placeholder="Contoh: Finance"
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                value={form.new_category}
                onChange={(e) => {
                  onChange(e);
                  if (e.target.value.trim().length > 0)
                    setForm((s) => ({ ...s, category_id: "" }));
                }}
              />
              <p className="mt-1 text-xs text-primary/60">
                Jika diisi, FE akan mengirim <b>category_name</b> ke BE.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Status</label>
              <select
                name="status_id"
                value={form.status_id}
                onChange={onChange}
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
                name="priority_id"
                value={form.priority_id}
                onChange={onChange}
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

          <button
            type="submit"
            disabled={saving || !form.title.trim()}
            className={[
              "w-full rounded-xl px-4 py-2 text-sm font-bold text-white transition",
              saving || !form.title.trim()
                ? "bg-primary/50 cursor-not-allowed"
                : "bg-primary hover:opacity-90",
            ].join(" ")}
          >
            {saving ? "Updating..." : "Update Task"}
          </button>
        </form>
      </div>
    </main>
  );
}
