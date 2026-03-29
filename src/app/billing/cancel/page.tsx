'use client';

import Link from 'next/link';

export default function BillingCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="mx-4 w-full max-w-md animate-scale-in rounded-2xl p-8 text-center shadow-lg"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--error-light)' }}
        >
          <svg className="h-8 w-8" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Pagamento annullato
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Non è stato effettuato alcun addebito. Puoi riprovare quando vuoi.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/dashboard/billing"
            className="block w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--accent)' }}
          >
            Torna ai piani
          </Link>
          <Link
            href="/dashboard"
            className="block w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
          >
            Vai alla dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
