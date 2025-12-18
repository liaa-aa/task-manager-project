import React, { useMemo, useState } from "react";
import { listCategories } from "../services/categories.service.js";
import { createTask, deleteTask, listMeta, listTasks, updateTask } from "../services/tasks.service.js";

export default function Tasks() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const categories = useMemo(() => listCategories(), [tick]);
  const meta = useMemo(() => listMeta(), []);
  const [filters, setFilters] = useState({ q: "", status_id: "", priority_id: "", category_id: "" });

  const tasks = useMemo(() => listTasks(filters), [tick, filters]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    category_id: "",
    status_id: 1,
    priority_id: 2,
  });

  const [err, setErr] = useState("");

  const onCreate = (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!form.title.trim()) throw new Error("Title wajib.");
      createTask(form);
      setForm({ title: "", description: "", due_date: "", category_id: "", status_id: 1, priority_id: 2 });
      refresh();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Create Task</div>
        {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

        <form onSubmit={onCreate} style={{ display: "grid", gap: 8 }}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8 }}>
            <label>
              Due date
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm((s) => ({ ...s, due_date: e.target.value }))}
              />
            </label>

            <label>
              Category
              <select
                value={form.category_id}
                onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={form.status_id}
                onChange={(e) => setForm((s) => ({ ...s, status_id: e.target.value }))}
              >
                {meta.statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select
                value={form.priority_id}
                onChange={(e) => setForm((s) => ({ ...s, priority_id: e.target.value }))}
              >
                {meta.priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit">Add Task</button>
        </form>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Filters</div>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8 }}>
          <input
            placeholder="Search title..."
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
          <select value={filters.status_id} onChange={(e) => setFilters((f) => ({ ...f, status_id: e.target.value }))}>
            <option value="">All status</option>
            {meta.statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={filters.priority_id}
            onChange={(e) => setFilters((f) => ({ ...f, priority_id: e.target.value }))}
          >
            <option value="">All priority</option>
            {meta.priorities.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            value={filters.category_id}
            onChange={(e) => setFilters((f) => ({ ...f, category_id: e.target.value }))}
          >
            <option value="">All categories</option>
            <option value="none">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            task={t}
            categories={categories}
            meta={meta}
            onSave={(patch) => {
              updateTask(t.id, patch);
              refresh();
            }}
            onDelete={() => {
              deleteTask(t.id);
              refresh();
            }}
          />
        ))}
        {tasks.length === 0 && <div style={{ opacity: 0.7 }}>No tasks</div>}
      </div>
    </div>
  );
}

function TaskRow({ task, categories, meta, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description || "",
    due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 10) : "",
    category_id: task.category_id ?? "",
    status_id: task.status_id,
    priority_id: task.priority_id,
  });

  const catName = categories.find((c) => c.id === task.category_id)?.name || "No category";
  const statusName = meta.statuses.find((s) => s.id === task.status_id)?.name || "-";
  const prioName = meta.priorities.find((p) => p.id === task.priority_id)?.name || "-";

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      {edit ? (
        <div style={{ display: "grid", gap: 8 }}>
          <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8 }}>
            <input
              type="date"
              value={draft.due_date}
              onChange={(e) => setDraft((d) => ({ ...d, due_date: e.target.value }))}
            />
            <select
              value={draft.category_id}
              onChange={(e) => setDraft((d) => ({ ...d, category_id: e.target.value }))}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select value={draft.status_id} onChange={(e) => setDraft((d) => ({ ...d, status_id: e.target.value }))}>
              {meta.statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={draft.priority_id}
              onChange={(e) => setDraft((d) => ({ ...d, priority_id: e.target.value }))}
            >
              {meta.priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                onSave(draft);
                setEdit(false);
              }}
            >
              Save
            </button>
            <button
              onClick={() => {
                setDraft({
                  title: task.title,
                  description: task.description || "",
                  due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 10) : "",
                  category_id: task.category_id ?? "",
                  status_id: task.status_id,
                  priority_id: task.priority_id,
                });
                setEdit(false);
              }}
            >
              Cancel
            </button>
            <button onClick={onDelete}>Delete</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{task.title}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={onDelete}>Delete</button>
            </div>
          </div>

          {task.description && <div style={{ marginTop: 6, opacity: 0.85 }}>{task.description}</div>}

          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span>Category: {catName}</span>
            <span>Status: {statusName}</span>
            <span>Priority: {prioName}</span>
            <span>
              Due:{" "}
              {task.due_date ? new Date(task.due_date).toISOString().slice(0, 10) : "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
