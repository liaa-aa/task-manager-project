import { Link } from "react-router-dom";

export default function HomePublic() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/60 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Simple • Fast • Focused
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-primary sm:text-4xl lg:text-5xl">
            A Simple Solution for Task Management.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-primary sm:text-sm">
            Task Manager membantu kamu menyusun pekerjaan harian dengan lebih rapih:
            tambah task, atur status dan mengatur prioritas.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-primary/20 bg-white/60 px-5 py-3 text-sm font-bold text-primary hover:bg-white/80 transition"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="Fokus" value="1 App" />
            <StatCard label="Workflow" value="Todo → Done" />
            <StatCard label="Setup" value="Cepat" />
          </div>
        </div>

        <div className="relative">
          <div className="hidden sm:block absolute -inset-2 rounded-3xl bg-secondary/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-white/65 shadow-sm">
            <div className="flex items-center justify-between border-b border-primary/10 px-4 py-4 sm:px-5">
              <div className="font-extrabold text-primary">Preview</div>
              <div className="flex items-center gap-2">
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MiniCard title="Total Tasks" subtitle="3 tasks" />
                <MiniCard title="Done" subtitle="2 tasks" />
                <MiniCard title="Categories" subtitle="4 tasks" />
              </div>

              <div className="mt-5 rounded-2xl p-4 bg-amber-100/50 text-amber-800 border-amber-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="truncate font-bold text-primary">
                      Contoh Task: Kirim laporan mingguan
                    </div>
                    <div className="mt-1 text-xs text-primary/70">
                      Deadline 09 Jan 2026 • Priority High • Status Doing
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <Badge>Doing</Badge>
                      <Badge>High</Badge>
                      <Badge>Due: 09 Jan 2026</Badge>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full rounded-xl border border-primary/15 bg-white/70 px-3 py-2 text-xs font-bold text-primary hover:bg-white transition sm:w-auto"
                  >
                    Detail
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <FeaturePill label="Status & Priority" />
                <FeaturePill label="Fast Add New" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-primary sm:text-2xl">How it works</h2>
            <p className="mt-1 text-sm text-primary/75">
              Alur sederhana, tidak bikin pusing.
            </p>
          </div>
          <div className="hidden sm:block text-xs font-semibold text-primary/60">
            3 langkah • 1 tujuan: selesaiin task.
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StepCard
            n="01"
            title="Login / Register"
            desc="Masuk ke akunmu agar task tersimpan khusus untuk kamu."
          />
          <StepCard
            n="02"
            title="Tambah Task"
            desc="Isi judul, deskripsi (opsional), status & prioritas, lalu simpan."
          />
          <StepCard
            n="03"
            title="Kelompokkan"
            desc="Buat kategori sendiri dan lihat task terkumpul otomatis di Home."
          />
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="rounded-3xl border border-primary/15 bg-white/60 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-primary sm:text-2xl">What you get</h2>
              <p className="mt-1 text-sm text-primary/75">
                Fitur yang cukup untuk produktif, tanpa noise.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition"
            >
              Start Now
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FeatureCard
              title="Status & Priority"
              desc="Biar kamu gampang bedain mana yang urgent dan mana yang bisa nanti."
              tags={["Todo/Doing/Done", "Low/Medium/High"]}
            />
            <FeatureCard
              title="Category by User"
              desc="Kategori bebas kamu buat sendiri sesuai kebutuhanmu."
              tags={["Custom categories", "Grouped view"]}
            />
          </div>
        </div>
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="rounded-3xl border border-primary/15 bg-primary p-6 text-white sm:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                Ready to get things done?
              </h3>
              <p className="mt-2 text-white/80 text-sm sm:text-base">
                Buat akun dan mulai menata task-mu dengan cara yang simple dan cepat.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/15 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-10 pb-6 text-center text-xs text-primary/60">
        © {new Date().getFullYear()} Task Manager • Built for a clean workflow.
      </footer>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-white/60 p-4">
      <div className="text-xs font-semibold text-primary/60">{label}</div>
      <div className="mt-1 text-lg font-black text-primary">{value}</div>
    </div>
  );
}

function MiniCard({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 p-4">
      <div className="font-bold text-primary">{title}</div>
      <div className="mt-1 text-xs text-primary/60">{subtitle}</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base">
        <div className="h-full w-2/3 rounded-full bg-accent" />
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/15 bg-white/70 px-2 py-0.5 font-semibold text-primary">
      {children}
    </span>
  );
}

function FeaturePill({ label }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-white/70 px-3 py-2 text-center text-xs font-bold text-primary">
      {label}
    </div>
  );
}

function StepCard({ n, title, desc }) {
  return (
    <div className="rounded-3xl border border-primary/15 bg-white/60 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-black text-accent">{n}</div>
        <div className="h-2 w-2 rounded-full bg-secondary" />
      </div>
      <div className="mt-3 text-lg font-extrabold text-primary">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-primary/75">{desc}</p>
    </div>
  );
}

function FeatureCard({ title, desc, tags = [] }) {
  return (
    <div className="rounded-3xl border border-primary/15 bg-white/70 p-6">
      <div className="text-lg font-extrabold text-primary">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-primary/75">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-primary/15 bg-white/70 px-2 py-1 text-xs font-semibold text-primary"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div className="rounded-3xl border border-primary/15 bg-white/60 p-6">
      <div className="text-sm font-extrabold text-primary">{q}</div>
      <p className="mt-2 text-sm leading-relaxed text-primary/75">{a}</p>
    </div>
  );
}
