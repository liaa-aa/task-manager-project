import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppProvider.jsx";

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/home", { replace: true });
    } catch (e) {
      // coba ambil error dari axios response
      const msg =
        e?.response?.data?.message ||
        e?.response?.data ||
        e?.message ||
        "Login gagal";
      setErr(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md p-6">
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">Login</h1>
        <p className="mt-1 text-sm text-primary/70">Masuk untuk melihat task milikmu.</p>

        {err ? (
          <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-3 text-sm font-semibold text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-primary/80">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-primary/80">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-accent/60 bg-white px-3 py-2 text-sm text-primary outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className={[
              "w-full rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
              loading ? "bg-secondary/60 cursor-not-allowed" : "bg-secondary hover:opacity-90",
            ].join(" ")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-primary/70">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-secondary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
