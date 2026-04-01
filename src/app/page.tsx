import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--success)' }}
        />
      </div>

      {/* Nav */}
      <nav className="glass sticky top-0 z-40 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            LinkedOS
          </span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ color: 'var(--text-secondary)' }}
            >
              Accedi
            </Link>
            <Link
              href="/register"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
              style={{ background: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}
            >
              Inizia gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="animate-fade-in-up">
          <div
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-glow)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ background: 'var(--accent)' }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: 'var(--accent)' }}
              />
            </span>
            Powered by AI
          </div>

          <h1
            className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: 'var(--text-primary)' }}
          >
            Post LinkedIn che{' '}
            <span
              className="animate-gradient bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, var(--accent), #a855f7, var(--accent))',
                backgroundSize: '200% 200%',
              }}
            >
              catturano
            </span>
            <br />
            in pochi secondi
          </h1>

          <p
            className="stagger-1 animate-fade-in-up mx-auto mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            LinkedOS genera contenuti professionali per LinkedIn usando l&apos;intelligenza artificiale.
            Scrivi il topic, ottieni un post pronto da pubblicare.
          </p>

          <div className="stagger-2 animate-fade-in-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              Inizia gratis
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="rounded-2xl border px-8 py-4 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
                background: 'var(--bg-secondary)',
              }}
            >
              Ho già un account
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="stagger-3 animate-fade-in-up mt-24 grid w-full gap-4 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              title: 'Generazione istantanea',
              desc: 'Ottieni post professionali in secondi, non ore.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              ),
              title: "AI all'avanguardia",
              desc: 'Modelli linguistici avanzati per contenuti autentici.',
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Storico completo',
              desc: 'Tutti i tuoi post salvati e pronti da riutilizzare.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-default)',
              }}
            >
              <div
                className="mb-4 inline-flex rounded-xl p-2.5 transition-colors duration-300"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                {f.icon}
              </div>
              <h3
                className="mb-1 text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs" style={{ borderColor: 'var(--border-default)', color: 'var(--text-tertiary)' }}>
        &copy; {new Date().getFullYear()} LinkedOS. Tutti i diritti riservati.
      </footer>
    </div>
  );
}
