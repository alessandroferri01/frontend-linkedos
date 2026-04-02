'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

const freePlan = {
  name: 'Free',
  price: '0',
  features: [
    { text: '5 crediti', description: 'Per iniziare a creare contenuti' },
    { text: 'Modello AI base', description: 'Generazione veloce, ideale per bozze rapide' },
    { text: 'Lunghezza media', description: 'Post di lunghezza standard' },
    { text: 'Storico post', description: 'Accesso ai post generati' },
  ],
};

const proPlan = {
  name: 'Pro',
  price: '19',
  features: [
    { text: '30 crediti/mese', description: 'Crediti rinnovati ogni mese' },
    { text: 'Modello AI avanzato', description: 'Più creativo, preciso e articolato' },
    { text: 'Lunghezza personalizzabile', description: 'Scegli tra post brevi, medi o lunghi' },
    { text: 'Storico post', description: 'Accesso ai post generati' },
    { text: 'Supporto prioritario', description: 'Assistenza dedicata via email' },
  ],
};

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isPro = user?.subscriptionStatus === 'ACTIVE';

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

  async function handleCancel() {
    if (!confirm('Sei sicuro di voler annullare il tuo abbonamento Pro? Tornerai al piano Free con 5 crediti.')) return;
    setCancelLoading(true);
    setError('');
    try {
      const { cancelled } = await api.billing.cancelSubscription();
      if (cancelled) {
        const updatedUser = await api.auth.me();
        setUser(updatedUser);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nell\'annullamento');
    } finally {
      setCancelLoading(false);
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
          <ul className="mt-6 space-y-4">
            {freePlan.features.map((f) => (
              <li key={f.text} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.text}</span>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            disabled
            className="mt-6 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50"
            style={{
              borderColor: 'var(--border-default)',
              color: !isPro ? 'var(--text-tertiary)' : 'var(--text-secondary)',
            }}
          >
            {!isPro ? 'Piano attuale' : 'Piano base'}
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
          <ul className="mt-6 space-y-4">
            {proPlan.features.map((f) => (
              <li key={f.text} className="flex items-start gap-2.5">
                <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.text}</span>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={isPro ? undefined : handleUpgrade}
            disabled={loading || isPro}
            className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
          >
            {isPro ? (
              'Piano attuale'
            ) : loading ? (
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

      {/* Sezione annullamento */}
      {isPro && (
        <div
          className="rounded-2xl border p-6"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Annulla abbonamento
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Se annulli il piano Pro, tornerai al piano Free con 5 crediti mensili.
          </p>
          <button
            onClick={handleCancel}
            disabled={cancelLoading}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            style={{
              borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)',
              color: 'var(--error)',
            }}
          >
            {cancelLoading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Annullamento...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Annulla piano Pro
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
