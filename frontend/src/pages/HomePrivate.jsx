import { useMemo } from "react";
import { useApp } from "../data/AppProvider.jsx";

export default function HomePrivate() {
  const { user, tasksForUser, deleteTask, statuses, priorities, categoriesForUser } = useApp();

  const tasks = tasksForUser(user.id);
  const categories = categoriesForUser(user.id);

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
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Home</h1>
        <p className="text-sm text-primary/80">
          Task milik <span className="font-semibold">{user.name}</span> dikelompokkan per kategori.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((c) => (
          <CategorySection
            key={c.id}
            title={c.name}
            tasks={grouped.get(c.id) || []}
            onDelete={deleteTask}
            statuses={statuses}
            priorities={priorities}
          />
        ))}

        <CategorySection
          title="Uncategorized"
          tasks={grouped.get("") || []}
          onDelete={deleteTask}
          statuses={statuses}
          priorities={priorities}
          muted
        />
      </div>
    </div>
  );
}

function CategorySection({ title, tasks, onDelete, muted, statuses, priorities }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
      <div className={`px-4 py-3 ${muted ? "bg-accent/10" : "bg-accent/25"}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-primary">{title}</div>
          <div className="text-xs text-primary/70">{tasks.length} task</div>
        </div>
      </div>

      <div className="divide-y divide-accent/40">
        {tasks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-primary/70">
            Tidak ada task di kategori ini.
          </div>
        ) : (
          tasks.map((t) => {
            const statusName = (statuses || []).find((s) => s.id === t.status_id)?.name || "-";
            const priorityName = (priorities || []).find((p) => p.id === t.priority_id)?.name || "-";

            return (
              <div
                key={t.id}
                className="px-4 py-3 flex items-start justify-between gap-3 hover:bg-accent/10 transition"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-primary truncate">{t.title}</div>

                  {t.description ? (
                    <div className="mt-1 text-xs text-primary/70 line-clamp-2">{t.description}</div>
                  ) : (
                    <div className="mt-1 text-xs text-primary/40">No description</div>
                  )}

                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 font-semibold text-primary">
                      Status: {statusName}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 font-semibold text-primary">
                      Priority: {priorityName}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 font-semibold text-primary">
                      Due: {t.due_date || "-"}
                    </span>
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
            );
          })
        )}
      </div>
    </div>
  );
}
