import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

export default function Sidebar({ open, onClose, logged, userName, onLogout }) {
  return (
    <div
      className={[
        "fixed inset-0 z-[60] md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Sidebar menu"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose?.();
      }}
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black transition-opacity duration-200",
          open ? "opacity-50" : "opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          "absolute left-0 top-0 h-full w-[86%] max-w-[360px]",
          "bg-white border-r border-black/10 shadow-2xl",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >

        <div className="flex items-center justify-between border-b border-black/10 px-4 py-4">
          <div className="text-sm font-extrabold text-primary">Menu</div>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white hover:bg-base/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[calc(100vh-64px)] overflow-auto px-4 py-4 pb-6">
          {logged ? (
            <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-semibold text-primary/60">
                Signed in as
              </div>
              <div className="mt-1 font-extrabold text-primary truncate">
                {userName}
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-sm font-semibold text-primary">
                Login untuk akses fitur lengkap.
              </div>
            </div>
          )}

          <nav className="grid gap-2">
            {!logged ? (
              <>
                <NavItem to="/login" onClick={onClose}>
                  Login
                </NavItem>
                <NavItem to="/register" onClick={onClose} variant="outline">
                  Register
                </NavItem>
              </>
            ) : (
              <>
                <NavItem to="/home" onClick={onClose}>
                  Home
                </NavItem>
                <NavItem to="/add" onClick={onClose}>
                  + Add New
                </NavItem>

                <button
                  type="button"
                  onClick={() => {
                    onClose?.();
                    onLogout?.();
                  }}
                  className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-700 hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </aside>
    </div>
  );
}

function NavItem({ to, children, onClick, variant = "solid" }) {
  const base =
    "block w-full rounded-xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary/20";
  const solid = "bg-secondary text-white hover:opacity-90";
  const outline =
    "border border-black/10 bg-white text-primary hover:bg-base/40";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          base,
          variant === "outline" ? outline : solid,
          isActive ? "ring-2 ring-primary/15" : "",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
