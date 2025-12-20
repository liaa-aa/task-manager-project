import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearSession, getUser, isLoggedIn } from "../lib/session.js";

export default function Navbar() {
  const nav = useNavigate();
  const logged = isLoggedIn();
  const user = getUser();

  const logout = () => {
    clearSession();
    nav("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-primary backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-extrabold text-base">
          Task Manager
        </Link>

        <div className="flex items-center gap-3">
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
              <div className="hidden sm:block text-sm font-semibold text-primary/80">
                Hi, {user?.name || "User"}
              </div>

              <NavLink
                to="/home"
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-bold hover:bg-secondary hover:text-white "
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
    </header>
  );
}
