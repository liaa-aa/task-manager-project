import { Link } from "react-router-dom";

export default function HomePublic() {
  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <div className="rounded-2xl border border-accent/60 bg-white/70 p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold text-primary">Task Manager</h1>
        <p className="mt-2 text-primary/80">
          Website untuk mencatat dan mengelola task kamu dengan rapi. Setelah login,
          kamu bisa melihat task milikmu dan daftar task akan dikelompokkan berdasarkan kategori.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/login"
            className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-accent/70 bg-accent/15 px-4 py-2 text-sm font-semibold text-primary hover:bg-accent/25 transition"
          >
            Register
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard title="Kelola Task" desc="Tambah, lihat, dan hapus task dengan cepat." />
        <FeatureCard title="Berdasarkan Kategori" desc="Task tampil terkelompok agar lebih rapi." />
        <FeatureCard title="Sederhana" desc="Cocok untuk submission: UI clean & mudah dipahami." />
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="rounded-2xl border border-accent/60 bg-white/70 p-5 shadow-sm">
      <div className="text-primary font-semibold">{title}</div>
      <div className="mt-1 text-sm text-primary/70">{desc}</div>
    </div>
  );
}
