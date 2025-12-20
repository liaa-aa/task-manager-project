import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { clearSession, getUser, isLoggedIn } from "../lib/session.js";
import Sidebar from "./Sidebar.jsx";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const logged = isLoggedIn();
  const user = getUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    clearSession();
    nav("/", { replace: true });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            onClick={() => setSidebarOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="text-lg font-extrabold text-base text-white">
            Task Manager
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!logged ? (
            <>
              <NavLink
                to="/login"
                className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-70"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-black font-bold hover:bg-secondary hover:text-white"
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              <div className="hidden lg:block text-sm font-semibold text-white/80">
                Hi, {user?.name || "User"}
              </div>

              <NavLink
                to="/home"
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold hover:bg-secondary hover:text-white"
              >
                Home
              </NavLink>
              <NavLink
                to="/add"
                className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-white hover:text-primary"
              >
                + Add New
              </NavLink>
              <button
                onClick={logout}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        logged={logged}
        userName={user?.name || "User"}
        onLogout={logout}
      />
    </header>
  );
}
