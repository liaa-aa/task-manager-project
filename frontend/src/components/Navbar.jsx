import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to={user ? "/home" : "/"} className="font-bold tracking-wide">
          Task Manager
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm opacity-90">
                Hi, <span className="font-semibold">{user.name}</span>
              </span>

              <Link
                to="/home"
                className="rounded-xl bg-accent/20 border border-accent/50 px-3 py-1.5 text-sm font-semibold hover:bg-accent/30 transition"
              >
                Home
              </Link>

              <Link
                to="/add"
                className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-semibold hover:opacity-90 transition"
              >
                + Add New
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate("/", { replace: true });
                }}
                className="rounded-xl border border-accent/50 bg-accent/20 px-3 py-1.5 text-sm font-semibold hover:bg-accent/30 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-semibold hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
