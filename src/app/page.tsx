import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Genera post LinkedIn
          <span className="text-blue-600"> con l&apos;AI</span>
        </h1>
        <p className="text-lg text-gray-600 leading-8">
          LinkedOS ti aiuta a creare contenuti professionali per LinkedIn in pochi secondi.
          Scegli il topic e lascia fare all&apos;intelligenza artificiale.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Inizia gratis
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Accedi
          </Link>
        </div>
      </main>
    </div>
  );
}
