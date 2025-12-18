import { listTasks } from "../services/tasks.service.js";
import { listCategories } from "../services/categories.service.js";

export default function Dashboard() {
  const tasks = listTasks();
  const cats = listCategories();

  const done = tasks.filter((t) => t.status_id === 3).length;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        <Card title="Total Tasks" value={tasks.length} />
        <Card title="Done" value={done} />
        <Card title="Categories" value={cats.length} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
      <div style={{ opacity: 0.7, fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
