import { Link } from "react-router-dom";
import { useData } from "../data/DataProvider.jsx";

export default function Dashboard() {
  const { db } = useData();

  const totalTasks = db?.tasks?.length || 0;
  const totalCategories = db?.categories?.length || 0;

  // Done = status name "Done" (case-insensitive)
  const doneStatusIds =
    db?.statuses?.filter((s) => s.name?.toLowerCase() === "done").map((s) => s.id) || [];

  const doneCount =
    db?.tasks?.filter((t) => doneStatusIds.includes(t.status_id)).length || 0;

  const recentTasks = [...(db?.tasks || [])]
    .sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""))
    .slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-primary/80 text-sm">
          Ringkasan aktivitas dan akses cepat ke fitur utama.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          helper="Jumlah task yang kamu miliki"
        />
        <StatCard
          title="Done"
          value={doneCount}
          helper="Task yang sudah selesai"
        />
        <StatCard
          title="Categories"
          value={totalCategories}
          helper="Jumlah kategori yang tersedia"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-primary">Quick Actions</h2>
          <p className="mt-1 text-sm text-primary/70">
            Akses cepat untuk mengelola data.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/tasks"
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Manage Tasks
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center justify-center rounded-xl border border-accent/70 bg-accent/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent/30 transition"
            >
              Manage Categories
            </Link>

            <Link
              to="/statuses"
              className="inline-flex items-center justify-center rounded-xl border border-accent/70 bg-accent/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent/30 transition"
            >
              Manage Statuses
            </Link>

            <Link
              to="/priorities"
              className="inline-flex items-center justify-center rounded-xl border border-accent/70 bg-accent/20 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent/30 transition"
            >
              Manage Priorities
            </Link>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-2xl border border-accent/60 bg-accent/20 p-5">
          <h2 className="text-base font-semibold text-primary">Tips</h2>
          <ul className="mt-3 space-y-2 text-sm text-primary/80">
            <li>• Buat status & priority dulu biar task kamu rapi.</li>
            <li>• Pakai kategori untuk grouping task.</li>
            <li>• Prioritaskan task High untuk dikerjakan dulu.</li>
          </ul>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="mt-6 rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-primary">Recent Tasks</h2>
          <Link
            to="/tasks"
            className="text-sm font-semibold text-secondary hover:underline"
          >
            View all
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="mt-4 rounded-xl border border-accent/60 bg-base/40 p-4 text-sm text-primary/80">
            Belum ada task. Mulai dengan membuat task pertama kamu.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-accent/40">
            {recentTasks.map((t) => (
              <RecentTaskRow key={t.id} task={t} db={db} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, helper }) {
  return (
    <div className="rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
      <div className="text-sm font-medium text-primary/80">{title}</div>
      <div className="mt-2 flex items-end gap-2">
        <div className="text-3xl font-extrabold text-primary">{value}</div>
        <div className="text-xs text-primary/60 pb-1">items</div>
      </div>
      <div className="mt-2 text-xs text-primary/70">{helper}</div>
    </div>
  );
}

function RecentTaskRow({ task, db }) {
  const status = db?.statuses?.find((s) => s.id === task.status_id)?.name || "-";
  const priority = db?.priorities?.find((p) => p.id === task.priority_id)?.name || "-";
  const category = db?.categories?.find((c) => c.id === task.category_id)?.name || "-";

  return (
    <div className="py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="font-semibold text-primary truncate">{task.title}</div>
        <div className="mt-1 text-xs text-primary/70 flex flex-wrap gap-2">
          <Badge label={`Status: ${status}`} />
          <Badge label={`Priority: ${priority}`} />
          <Badge label={`Category: ${category}`} />
        </div>
      </div>

      {task.due_date ? (
        <div className="text-xs text-primary/70">
          Due: <span className="font-semibold">{task.due_date}</span>
        </div>
      ) : (
        <div className="text-xs text-primary/50">No due date</div>
      )}
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
      {label}
    </span>
  );
}
