import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Home, PlusCircle, LogOut } from "lucide-react";
import { useApp } from "../data/AppProvider.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, session, logout } = useApp();

  const [open, setOpen] = useState(false);

  const isAuthed = Boolean(session?.token && user);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const close = () => setOpen(false);

  const go = (to) => {
    close();
    navigate(to);
  };

  const doLogout = () => {
    close();
    logout();
    navigate("/home", { replace: true });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-primary text-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* LEFT: brand + hamburger (ONLY MOBILE) */}
          <div className="flex items-center gap-3">
            {/* Hamburger: only show on mobile */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/15 transition md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="font-black tracking-tight">Task Manager</div>
          </div>

          {/* RIGHT AREA */}
          <div className="flex items-center gap-3">
            {/* Desktop menu (≥ md) */}
            <div className="hidden items-center gap-2 md:flex">
              {isAuthed ? (
                <>
                  <TopLink to="/home" label="Home" />
                  <TopLink to="/add" label="+ Add New" />
                  <button
                    onClick={doLogout}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="rounded-xl bg-secondary px-3 py-2 text-sm font-bold text-white hover:opacity-90 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/15 transition"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>

            {/* Greeting/profile (always right) */}
            <div className="min-w-0 text-right">
              {isAuthed ? (
                <>
                  <div className="truncate text-sm font-semibold text-white/90">
                    Hi, <span className="font-black text-white">{user?.name || "User"}</span>
                  </div>
                  <div className="truncate text-[11px] text-white/70">{user?.email || ""}</div>
                </>
              ) : (
                <div className="text-sm font-semibold text-white/85">Welcome 👋</div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========= MOBILE DRAWER ONLY ========= */}
      {/* Backdrop (only active on mobile because hamburger only exists on mobile) */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition md:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={close}
      />

      {/* Drawer RIGHT */}
      <aside
        className={[
          "fixed right-0 top-0 z-50 h-full w-[82%] max-w-sm border-l border-primary/10 bg-base shadow-2xl transition-transform md:hidden",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Side menu"
      >
        <div className="flex h-16 items-center justify-between border-b border-primary/10 bg-white/70 px-4">
          <div className="font-black text-primary">Menu</div>
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-primary/10 bg-white/70 p-2 text-primary hover:bg-white transition"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {isAuthed ? (
            <nav className="space-y-2">
              <DrawerLink to="/home" icon={<Home className="h-5 w-5" />} label="Home" onGo={go} />
              <DrawerLink
                to="/add"
                icon={<PlusCircle className="h-5 w-5" />}
                label="Add New"
                onGo={go}
              />

              <button
                onClick={doLogout}
                className="flex w-full items-center gap-3 rounded-2xl border border-accent/30 bg-white/70 px-4 py-3 text-sm font-bold text-primary hover:bg-white transition"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  close();
                  navigate("/login");
                }}
                className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-bold text-white hover:opacity-90 transition"
              >
                Login
              </button>

              <button
                onClick={() => {
                  close();
                  navigate("/register");
                }}
                className="w-full rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-sm font-bold text-primary hover:bg-white transition"
              >
                Create Account
              </button>

              <button
                onClick={() => {
                  close();
                  navigate("/home");
                }}
                className="w-full rounded-2xl border border-primary/10 bg-white/70 px-4 py-3 text-sm font-bold text-primary hover:bg-white transition"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function TopLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-xl px-3 py-2 text-sm font-bold transition",
          isActive ? "bg-white/15 text-white" : "text-white/85 hover:bg-white/10 hover:text-white",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

function DrawerLink({ to, icon, label, onGo }) {
  return (
    <NavLink
      to={to}
      onClick={(e) => {
        e.preventDefault();
        onGo(to);
      }}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition",
          isActive
            ? "border-secondary/30 bg-secondary/15 text-primary"
            : "border-primary/10 bg-white/70 text-primary hover:bg-white",
        ].join(" ")
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
