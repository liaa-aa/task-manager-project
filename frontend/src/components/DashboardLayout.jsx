import { Link, Outlet, useNavigate } from "react-router-dom";
import { logout, getSession } from "../services/auth.service.js";

export default function DashboardLayout() {
  const nav = useNavigate();
  const session = getSession();

  const onLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
        <div style={{ marginBottom: 12, fontWeight: 700 }}>Task Manager</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 16 }}>
          {session?.user?.name} ({session?.user?.email})
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/categories">Categories</Link>
        </nav>

        <button onClick={onLogout} style={{ marginTop: 16 }}>
          Logout
        </button>
      </aside>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
