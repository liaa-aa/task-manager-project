import React, { useMemo, useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Priorities() {
  const { db, createPriority, updatePriority, deletePriority } = useData();

  const [name, setName] = useState("");
  const [q, setQ] = useState("");

  const priorities = useMemo(() => {
    const items = [...(db.priorities || [])];
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((p) => (p.name || "").toLowerCase().includes(qq));
  }, [db.priorities, q]);

  const onAdd = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    createPriority(v);
    setName("");
  };

  const onDelete = (priority) => {
    const ok = confirm(
      `Hapus priority: "${priority.name}"?\nPastikan task yang memakai priority ini aman (nanti saat integrasi BE).`
    );
    if (!ok) return;
    deletePriority(priority.id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Priorities</h1>
        <p className="text-sm text-primary/80">
          Kelola prioritas task (Low, Medium, High).
        </p>
      </div>

      {/* Add + Search */}
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* Add */}
          <form onSubmit={onAdd} className="lg:col-span-3">
            <label className="text-xs font-semibold text-primary/80">Add Priority</label>
            <div className="mt-1 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Low, Medium, High..."
                className="w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
              >
                Add
              </button>
            </div>
            <p className="mt-1 text-xs text-primary/60">
              Disarankan minimal punya: Low, Medium, High.
            </p>
          </form>

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-primary/80">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari priority..."
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
            <div className="mt-2 text-xs text-primary/70">
              Total:{" "}
              <span className="font-semibold text-primary">{priorities.length}</span>{" "}
              priorities
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
        <div className="bg-accent/25 px-4 py-3">
          <div className="text-sm font-semibold text-primary">Priority List</div>
          <div className="text-xs text-primary/70">
            Edit langsung di baris, tanpa modal.
          </div>
        </div>

        <div className="divide-y divide-accent/40">
          {priorities.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-primary/70">
              Priority tidak ditemukan. Tambahkan priority baru di atas.
            </div>
          ) : (
            priorities.map((p) => (
              <PriorityRow
                key={p.id}
                priority={p}
                onSave={(nextName) => updatePriority(p.id, nextName)}
                onDelete={() => onDelete(p)}
              />
            ))
          )}
        </div>
      </div>

      {/* Hint box */}
      <div className="mt-4 rounded-2xl border border-accent/60 bg-accent/15 p-4">
        <div className="text-sm font-semibold text-primary">Rekomendasi</div>
        <ul className="mt-2 space-y-1 text-sm text-primary/80">
          <li>• High → urgent / penting, kerjakan dulu</li>
          <li>• Medium → normal, dikerjakan setelah high</li>
          <li>• Low → ringan, bisa dikerjakan belakangan</li>
        </ul>
      </div>
    </div>
  );
}

function PriorityRow({ priority, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(priority.name || "");

  const cancel = () => {
    setVal(priority.name || "");
    setEdit(false);
  };

  const save = () => {
    const v = val.trim();
    if (!v) return;
    onSave(v);
    setEdit(false);
  };

  const badgeTone = toneByName(priority.name);

  return (
    <div className="px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        {edit ? (
          <input
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
              ID: {priority.id}
            </span>

            <span className={badgeTone}>{priority.name}</span>
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-end gap-2">
        {edit ? (
          <>
            <button
              onClick={save}
              className="rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="rounded-xl border border-accent/70 bg-accent/15 px-3 py-2 text-xs font-semibold text-primary hover:bg-accent/25 transition"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEdit(true)}
              className="rounded-xl border border-accent/70 bg-accent/15 px-3 py-2 text-xs font-semibold text-primary hover:bg-accent/25 transition"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function toneByName(name) {
  const n = (name || "").toLowerCase();

  if (n.includes("high")) {
    return "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700";
  }
  if (n.includes("medium")) {
    return "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800";
  }
  // default: low / others
  return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700";
}
