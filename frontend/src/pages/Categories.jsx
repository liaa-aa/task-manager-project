import React, { useMemo, useState } from "react";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../services/categories.service.js";

export default function Categories() {
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const items = useMemo(() => listCategories(), [tick]);

  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  const onCreate = (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!name.trim()) throw new Error("Nama category wajib.");
      createCategory({ name });
      setName("");
      refresh();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div>
      <h2>Categories</h2>

      <form onSubmit={onCreate} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <div style={{ display: "grid", gap: 8 }}>
        {items.map((c) => (
          <Row
            key={c.id}
            item={c}
            onSave={(newName) => {
              updateCategory(c.id, { name: newName });
              refresh();
            }}
            onDelete={() => {
              deleteCategory(c.id);
              refresh();
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ item, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(item.name);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, display: "flex", gap: 8 }}>
      {edit ? (
        <input value={val} onChange={(e) => setVal(e.target.value)} style={{ flex: 1 }} />
      ) : (
        <div style={{ flex: 1 }}>{item.name}</div>
      )}

      {edit ? (
        <>
          <button
            onClick={() => {
              onSave(val);
              setEdit(false);
            }}
          >
            Save
          </button>
          <button
            onClick={() => {
              setVal(item.name);
              setEdit(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setEdit(true)}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </>
      )}
    </div>
  );
}
