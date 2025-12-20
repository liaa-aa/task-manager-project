// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../lib/authApi.js";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      await loginApi({ email, password });
      navigate("/home", { replace: true });
    } catch (err) {
      setErrMsg(err.normalizedMessage || "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="rounded-2xl border border-primary/15 bg-white/70 p-6 shadow-sm">
        <h1 className="text-3xl font-black text-primary">Login</h1>
        <p className="mt-1 text-sm text-primary/70">Masuk untuk lihat task kamu.</p>

        {errMsg ? (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-primary">
            {errMsg}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-primary/80">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              type="email"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-primary/80">Password</label>
            <input
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
            />
          </div>

          <button
            disabled={loading}
            className={[
              "w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition",
              loading ? "bg-secondary/60 cursor-not-allowed" : "bg-secondary hover:opacity-90",
            ].join(" ")}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-sm text-primary/70">
            Belum punya akun?{" "}
            <Link className="font-bold text-accent" to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
