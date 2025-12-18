import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/auth.service.js";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const to = loc.state?.from || "/dashboard";

  const [email, setEmail] = useState("demo@demo.com");
  const [password, setPassword] = useState("demo");
  const [err, setErr] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");
    try {
      login({ email, password });
      nav(to, { replace: true });
    } catch (e) {
      setErr(e.message || "Login gagal");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "64px auto", padding: 16 }}>
      <h2>Login</h2>
      {err && <div style={{ color: "crimson", marginBottom: 8 }}>{err}</div>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>

        <button type="submit">Masuk</button>
      </form>

      <div style={{ marginTop: 12 }}>
        Belum punya akun? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
