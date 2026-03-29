import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">
        Benvenuto in LinkedOS. Usa la sidebar per navigare.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/generate"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">Genera Post</h2>
          <p className="mt-1 text-sm text-gray-600">
            Crea un nuovo post LinkedIn con l&apos;AI
          </p>
        </Link>

        <Link
          href="/dashboard/history"
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-gray-900">Storico Post</h2>
          <p className="mt-1 text-sm text-gray-600">
            Visualizza i post generati in precedenza
          </p>
        </Link>
      </div>
    </div>
  );
}
