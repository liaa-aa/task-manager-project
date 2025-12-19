import React, { useMemo, useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Statuses() {
  const { db, createStatus, updateStatus, deleteStatus } = useData();

  const [name, setName] = useState("");
  const [q, setQ] = useState("");

  const statuses = useMemo(() => {
    const items = [...(db.statuses || [])];
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((s) => (s.name || "").toLowerCase().includes(qq));
  }, [db.statuses, q]);

  const onAdd = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    createStatus(v);
    setName("");
  };

  const onDelete = (status) => {
    const ok = confirm(
      `Hapus status: "${status.name}"?\nPastikan task yang memakai status ini tidak error (nanti saat integrasi BE).`
    );
    if (!ok) return;
    deleteStatus(status.id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Statuses</h1>
        <p className="text-sm text-primary/80">
          Kelola status workflow (misal: Todo, Doing, Done).
        </p>
      </div>

      {/* Add + Search */}
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* Add */}
          <form onSubmit={onAdd} className="lg:col-span-3">
            <label className="text-xs font-semibold text-primary/80">Add Status</label>
            <div className="mt-1 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Todo, Doing, Done..."
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
              Disarankan minimal punya: Todo, Doing, Done.
            </p>
          </form>

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-primary/80">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari status..."
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
            <div className="mt-2 text-xs text-primary/70">
              Total:{" "}
              <span className="font-semibold text-primary">{statuses.length}</span>{" "}
              statuses
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
        <div className="bg-accent/25 px-4 py-3">
          <div className="text-sm font-semibold text-primary">Status List</div>
          <div className="text-xs text-primary/70">
            Edit langsung di baris, tanpa modal.
          </div>
        </div>

        <div className="divide-y divide-accent/40">
          {statuses.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-primary/70">
              Status tidak ditemukan. Tambahkan status baru di atas.
            </div>
          ) : (
            statuses.map((s) => (
              <StatusRow
                key={s.id}
                status={s}
                onSave={(nextName) => updateStatus(s.id, nextName)}
                onDelete={() => onDelete(s)}
              />
            ))
          )}
        </div>
      </div>

      {/* Hint box */}
      <div className="mt-4 rounded-2xl border border-accent/60 bg-accent/15 p-4">
        <div className="text-sm font-semibold text-primary">Tips workflow</div>
        <ul className="mt-2 space-y-1 text-sm text-primary/80">
          <li>• Todo → task baru / belum dikerjakan</li>
          <li>• Doing → sedang dikerjakan</li>
          <li>• Done → sudah selesai</li>
        </ul>
      </div>
    </div>
  );
}

function StatusRow({ status, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(status.name || "");

  const cancel = () => {
    setVal(status.name || "");
    setEdit(false);
  };

  const save = () => {
    const v = val.trim();
    if (!v) return;
    onSave(v);
    setEdit(false);
  };

  const badgeTone = toneByName(status.name);

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
              ID: {status.id}
            </span>

            <span className={badgeTone}>{status.name}</span>
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
  if (n.includes("done")) {
    return "inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700";
  }
  if (n.includes("doing") || n.includes("progress")) {
    return "inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700";
  }
  return "inline-flex items-center rounded-full border border-accent/70 bg-accent/20 px-2 py-0.5 text-[11px] font-semibold text-primary";
}
