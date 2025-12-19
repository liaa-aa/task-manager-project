import React, { useState } from "react";
import { useData } from "../data/DataProvider.jsx";

export default function Statuses() {
  const { db, createStatus, updateStatus, deleteStatus } = useData();
  const [name, setName] = useState("");

  return (
    <div>
      <h2>Statuses</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createStatus(name);
          setName("");
        }}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <input placeholder="New status" value={name} onChange={(e) => setName(e.target.value)} />
        <button>Add</button>
      </form>

      <div style={{ display: "grid", gap: 8 }}>
        {db.statuses.map((s) => (
          <Row
            key={s.id}
            value={s.name}
            onSave={(v) => updateStatus(s.id, v)}
            onDelete={() => deleteStatus(s.id)}
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
