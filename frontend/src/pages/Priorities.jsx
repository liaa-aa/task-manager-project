import React, { useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Priorities() {
  const { db, createPriority, updatePriority, deletePriority } = useData();
  const [name, setName] = useState("");

  return (
    <div>
      <h2>Priorities</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createPriority(name);
          setName("");
        }}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <input placeholder="New priority" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Add</button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        {db.priorities.map((p) => (
          <Row
            key={p.id}
            value={p.name}
            onSave={(v) => updatePriority(p.id, v)}
            onDelete={() => deletePriority(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ value, onSave, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(value);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12, display: "flex", gap: 8 }}>
      {edit ? <input value={val} onChange={(e) => setVal(e.target.value)} style={{ flex: 1 }} /> : <div style={{ flex: 1 }}>{value}</div>}

      {edit ? (
        <>
          <button onClick={() => { onSave(val); setEdit(false); }}>Save</button>
          <button onClick={() => { setVal(value); setEdit(false); }}>Cancel</button>
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
