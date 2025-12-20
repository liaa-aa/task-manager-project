import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err?.message || "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-base">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
          {/* Left: copy / info (hidden on small) */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Welcome back
            </div>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-primary">
              Login to continue.
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-primary/75">
              Masuk untuk melihat daftar task milikmu, dikelompokkan berdasarkan kategori,
              dan tambah task baru dengan cepat.
            </p>

            <div className="mt-6 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoPill label="Grouped by category" />
              <InfoPill label="Status & priority" />
              <InfoPill label="Fast add new" />
            </div>
          </div>

          {/* Right: form */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-primary/15 bg-white/70 p-5 shadow-sm sm:p-6">
              <div className="text-center">
                <h2 className="text-2xl font-black text-primary">Login</h2>
                <p className="mt-1 text-sm text-primary/70">
                  Masuk untuk mulai mengelola task.
                </p>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-primary">
                  {error}
                </div>
              ) : null}

              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-primary/80">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-primary/80">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={[
                    "w-full rounded-xl px-4 py-2.5 text-sm font-bold text-white transition",
                    loading ? "bg-secondary/60 cursor-not-allowed" : "bg-secondary hover:opacity-90",
                  ].join(" ")}
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

                <div className="text-center text-sm text-primary/70">
                  Belum punya akun?{" "}
                  <Link to="/register" className="font-bold text-primary hover:underline">
                    Register
                  </Link>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="w-full rounded-xl border border-primary/15 bg-white/70 px-4 py-2 text-sm font-semibold text-primary hover:bg-white transition"
                  >
                    Back to Home
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile helper */}
            <div className="mt-4 rounded-2xl border border-primary/10 bg-white/50 p-4 text-xs text-primary/70 lg:hidden">
              Tip: Gunakan akun yang sudah kamu register di halaman Register.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoPill({ label }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 px-3 py-2 text-center text-xs font-bold text-primary">
      {label}
    </div>
  );
}
