import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../services/auth.service.js";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const onLogout = () => {
    logout(); // ✅ clear session dari storage.js
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-base">
      {/* SIDEBAR */}
      <aside className="bg-primary text-white flex flex-col px-3 py-4">
        {/* BRAND */}
        <div className="mb-7 px-3">
          <h1 className="text-xl font-bold tracking-wide">Task Manager</h1>
          <p className="text-xs opacity-70">UI Version</p>
        </div>

        {/* MAIN MENU */}
        <MenuSection title="MAIN">
          <SidebarLink to="/dashboard" label="Dashboard" />
          <SidebarLink to="/tasks" label="Tasks" />
          <SidebarLink to="/categories" label="Categories" />
        </MenuSection>

        {/* MASTER DATA */}
        <MenuSection title="MASTER DATA">
          <SidebarLink to="/statuses" label="Statuses" />
          <SidebarLink to="/priorities" label="Priorities" />
        </MenuSection>

        {/* FOOTER */}
        <div className="mt-auto px-3">
          <button
            onClick={onLogout}
            className="w-full rounded-lg bg-secondary py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="bg-base p-6">
        {/* Header box */}
        <div className="mb-4 rounded-xl border border-accent/60 bg-accent/25 px-4 py-3">
          <p className="text-primary font-semibold">Welcome 👋</p>
          <p className="text-primary/80 text-sm">
            Kelola task kamu dengan cepat dan rapi.
          </p>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

function MenuSection({ title, children }) {
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[11px] font-bold tracking-widest opacity-70">
        {title}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "px-3 py-2 rounded-lg text-sm transition",
          isActive ? "bg-secondary font-semibold" : "hover:bg-accent/30",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}
