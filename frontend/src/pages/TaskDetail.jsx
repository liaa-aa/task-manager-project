import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTaskByIdApi } from "../lib/taskApi.js";

const STATUSES = new Map([
  [1, "Todo"],
  [2, "Doing"],
  [3, "Done"],
]);

const PRIORITIES = new Map([
  [1, "Low"],
  [2, "Medium"],
  [3, "High"],
]);

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const data = await getTaskByIdApi(id);
        if (!alive) return;
        setTask(data && typeof data === "object" && !Array.isArray(data) ? data : null);
      } catch (e) {
        if (!alive) return;
        setErr(e?.normalizedMessage || "Gagal memuat detail task.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-primary">Task Detail</h1>
        <Link
          to="/home"
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold hover:bg-black/5"
        >
          Back
        </Link>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {!task ? (
        <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
          Task tidak ditemukan.
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white/70 p-6">
          <div className="text-lg font-extrabold text-primary">{task.title}</div>
          <div className="mt-2 text-sm text-primary/80">{task.description || "-"}</div>

          <div className="mt-4 grid gap-2 text-sm text-primary/80">
            <div>
              <b>Status:</b> {STATUSES.get(Number(task.status_id)) || "-"}
            </div>
            <div>
              <b>Priority:</b> {PRIORITIES.get(Number(task.priority_id)) || "-"}
            </div>
            <div>
              <b>Category:</b> {task.category_name || "Uncategorized"}
            </div>
            <div>
              <b>Due Date:</b>{" "}
              {task.due_date ? new Date(task.due_date).toISOString().slice(0, 10) : "-"}
            </div>

            <Link
              to={`/task/${id}/edit`}
              title="Edit Task"
              className="mt-3 inline-flex h-9 w-13 items-center justify-center rounded-xl bg-primary text-white hover:opacity-90 transition"
            >Edit</Link>

          </div>
        </div>
      )}
    </main>
  );
}
