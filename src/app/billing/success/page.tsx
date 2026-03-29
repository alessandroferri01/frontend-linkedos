'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function BillingSuccessPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/dashboard';
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="mx-4 w-full max-w-md animate-scale-in rounded-2xl p-8 text-center shadow-lg"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'var(--success-light)' }}
        >
          <svg className="h-8 w-8" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Pagamento completato!
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Il tuo abbonamento Pro è ora attivo. Hai 100 crediti disponibili per generare post.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/dashboard/generate"
            className="block w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'var(--accent)' }}
          >
            Inizia a generare
          </Link>
          <Link
            href="/dashboard"
            className="block w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
          >
            Vai alla dashboard
          </Link>
        </div>

        <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          Verrai reindirizzato automaticamente tra 5 secondi...
        </p>
      </div>
    </div>
  );
}
