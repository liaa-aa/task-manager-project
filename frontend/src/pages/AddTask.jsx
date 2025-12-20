import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTaskApi } from "../lib/taskApi.js";
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
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const [statusId, setStatusId] = useState(1);
  const [priorityId, setPriorityId] = useState(2);
  const [dueDate, setDueDate] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setErrMsg("");
    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || "",
        status_id: Number(statusId),
        priority_id: Number(priorityId),
        due_date: dueDate || "",
      };

      const nc = newCategory.trim();
      if (nc) payload.category_name = nc;

      if (!nc && categoryId) payload.category_id = categoryId;

      await createTaskApi(payload);
      navigate("/home", { replace: true });
    } catch (err) {
      setErrMsg(err.normalizedMessage || "Gagal menambah task.");
    } finally {
      setLoading(false);
    }
  }

  // safety: kalau user belum login, jangan render form
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Add New Task</h1>
        <p className="text-sm text-primary/80">Tambahkan task baru.</p>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-white/70 p-5 shadow-sm">
        {errMsg ? (
          <div className="mb-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-primary">
            {errMsg}
          </div>
        ) : null}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-primary/80">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="Contoh: Kerjakan laporan"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              rows={4}
              placeholder="(Optional) detail task..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-primary/80">
                Category ID (optional)
              </label>
              <input
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="(optional) category_id existing"
              />
              <p className="mt-1 text-xs text-primary/60">
                Kalau kamu tidak punya list category dari BE, boleh kosong.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">New Category (optional)</label>
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                placeholder="Contoh: Kuliah"
              />
              <p className="mt-1 text-xs text-primary/60">
                Jika diisi, FE akan kirim <b>category_name</b> ke BE.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-primary/80">Status</label>
              <select
                value={statusId}
                onChange={(e) => setStatusId(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
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
                className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              >
                {PRIORITIES.map((p) => (
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
                className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="rounded-xl border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary hover:bg-white transition"
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
