'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const freePlan = {
  name: 'Free',
  price: '0',
  features: ['5 crediti', 'Generazione post AI', 'Storico post'],
};

const proPlan = {
  name: 'Pro',
  price: '19',
  features: ['100 crediti/mese', 'Generazione post AI', 'Storico post', 'Supporto prioritario'],
};

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setLoading(true);
    setError('');
    try {
      const { url } = await api.billing.createSession();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella creazione della sessione');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Abbonamento
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Scegli il piano più adatto alle tue esigenze.
        </p>
      </div>

      {error && (
        <div
          className="animate-scale-in flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'var(--error-light)', color: 'var(--error)' }}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Piano Free */}
        <div
          className="rounded-2xl border p-6 transition-all duration-200"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div
            className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }}
          >
            {freePlan.name}
          </div>
          <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            €{freePlan.price}
            <span className="text-base font-normal" style={{ color: 'var(--text-tertiary)' }}>
              /mese
            </span>
          </p>
          <ul className="mt-6 space-y-3">
            {freePlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            disabled
            className="mt-6 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
            }}
          >
            Piano attuale
          </button>
        </div>

        {/* Piano Pro */}
        <div
          className="relative rounded-2xl border-2 p-6 transition-all duration-200"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--accent)',
            boxShadow: 'var(--shadow-glow)',
          }}
        >
          <span
            className="absolute -top-3 left-5 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
          >
            Consigliato
          </span>
          <div
            className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
          >
            {proPlan.name}
          </div>
          <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
            €{proPlan.price}
            <span className="text-base font-normal" style={{ color: 'var(--text-tertiary)' }}>
              /mese
            </span>
          </p>
          <ul className="mt-6 space-y-3">
            {proPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Reindirizzamento...
              </>
            ) : (
              'Passa a Pro'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
