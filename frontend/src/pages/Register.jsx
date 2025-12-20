// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi, loginApi } from "../lib/authApi.js";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);

    try {
      await registerApi({ name, email, password });
      // setelah register sukses, baru login supaya dapat token
      await loginApi({ email, password });
      navigate("/home", { replace: true });
    } catch (err) {
      setErrMsg(err.normalizedMessage || "Register gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="rounded-2xl border border-primary/15 bg-white/70 p-6 shadow-sm">
        <h1 className="text-3xl font-black text-primary">Register</h1>
        <p className="mt-1 text-sm text-primary/70">
          Buat akun untuk mulai mengelola task.
        </p>

        {errMsg ? (
          <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-primary">
            {errMsg}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-primary/80">Name</label>
            <input
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="nama kamu"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-primary/80">Email</label>
            <input
              className="mt-1 w-full rounded-xl border border-primary/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email kamu"
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
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-sm text-primary/70">
            Sudah punya akun?{" "}
            <Link className="font-bold text-accent" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
