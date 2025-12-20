import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function AddTask() {
  const navigate = useNavigate();
  const {
    user,
    createTask,
    addCategory,
    categoriesForUser,
    statuses,
    priorities,
  } = useApp();

  const categories = categoriesForUser(user.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState(categories?.[0]?.id || "");
  const [newCategory, setNewCategory] = useState("");

  const [statusId, setStatusId] = useState(statuses?.[0]?.id || "1");
  const [priorityId, setPriorityId] = useState(
    priorities?.[1]?.id || priorities?.[0]?.id || "2"
  );

  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return;

    let finalCategoryId = categoryId || "";
    let finalCategoryName = "";

    const nc = newCategory.trim();
    if (nc) {
      // simpan local agar bisa dipakai UI grouping
      finalCategoryId = addCategory(user.id, nc) || "";
      // juga kirim ke BE sebagai category_name (kalau BE kamu handle)
      finalCategoryName = nc;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim(),
        category_id: finalCategoryId || null,
        category_name: finalCategoryName || undefined,
        status_id: statusId,
        priority_id: priorityId,
        due_date: dueDate || null,
      });

      navigate("/home", { replace: true });
    } catch (err) {
      setError(err?.message || "Gagal membuat task");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Add New Task</h1>
        <p className="text-sm text-primary/80">
          Tambahkan task baru. Category bisa kamu buat sendiri.
        </p>
      </div>

      <div className="rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
        <form onSubmit={submit} className="space-y-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold text-primary/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="Contoh: Kerjakan laporan"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              rows={4}
              placeholder="(Optional) detail task..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-primary/80">Category (existing)</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-primary/60">
                Pilih category yang sudah ada, atau buat baru di bawah.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">New Category (optional)</label>
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="Contoh: Freelance"
              />
              <p className="mt-1 text-xs text-primary/60">
                Jika diisi, category akan dibuat otomatis & dipakai.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {(statuses || []).map((s) => (
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
                {(priorities || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
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
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-xl border border-accent/70 bg-accent/15 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent/25 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!canSubmit}
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
                canSubmit ? "bg-secondary hover:opacity-90" : "bg-secondary/50 cursor-not-allowed",
              ].join(" ")}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
