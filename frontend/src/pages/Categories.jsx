import React, { useMemo, useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Categories() {
  const { db, createCategory, updateCategory, deleteCategory } = useData();

  const [name, setName] = useState("");
  const [q, setQ] = useState("");

  const categories = useMemo(() => {
    const items = [...(db.categories || [])];
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((c) => (c.name || "").toLowerCase().includes(qq));
  }, [db.categories, q]);

  const onAdd = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    createCategory(v);
    setName("");
  };

  const onDelete = (cat) => {
    const ok = confirm(`Hapus category: "${cat.name}"?\nTask yang memakai category ini akan jadi kosong.`);
    if (!ok) return;
    deleteCategory(cat.id);
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-primary">Categories</h1>
        <p className="text-sm text-primary/80">
          Kelola kategori untuk mengelompokkan task kamu.
        </p>
      </div>

      {/* Add + Search */}
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {/* Add form */}
          <form onSubmit={onAdd} className="lg:col-span-3">
            <label className="text-xs font-semibold text-primary/80">Add Category</label>
            <div className="mt-1 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Work, Personal, Study..."
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
              Tips: gunakan nama singkat, mis. “Work”, “Personal”.
            </p>
          </form>

          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-xs font-semibold text-primary/80">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari category..."
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
            />
            <div className="mt-2 text-xs text-primary/70">
              Total: <span className="font-semibold text-primary">{categories.length}</span> categories
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-accent/60 bg-white/70 shadow-sm">
        <div className="bg-accent/25 px-4 py-3">
          <div className="text-sm font-semibold text-primary">Category List</div>
          <div className="text-xs text-primary/70">Edit langsung di baris, tidak pakai modal.</div>
        </div>

        <div className="divide-y divide-accent/40">
          {categories.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-primary/70">
              Category tidak ditemukan. Tambahkan category baru di atas.
            </div>
          ) : (
            categories.map((c) => (
              <CategoryRow
                key={c.id}
                category={c}
                onSave={(nextName) => updateCategory(c.id, nextName)}
                onDelete={() => onDelete(c)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ category, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(category.name || "");

  const cancel = () => {
    setVal(category.name || "");
    setEdit(false);
  };

  const save = () => {
    const v = val.trim();
    if (!v) return;
    onSave(v);
    setEdit(false);
  };

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
              ID: {category.id}
            </span>
            <div className="font-semibold text-primary truncate">{category.name}</div>
          </div>
        )}

        {category.created_at ? (
          <div className="mt-1 text-xs text-primary/60">
            Created: <span className="font-semibold">{formatDate(category.created_at)}</span>
          </div>
        ) : (
          <div className="mt-1 text-xs text-primary/50">—</div>
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

function formatDate(iso) {
  // tampil singkat tanpa library, aman untuk submission
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return "-";
  }
}
