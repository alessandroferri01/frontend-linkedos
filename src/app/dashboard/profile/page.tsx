'use client';

import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  FREE: { label: 'Free', color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)' },
  ACTIVE: { label: 'Attivo', color: 'var(--success)', bg: 'var(--success-light)' },
  PAST_DUE: { label: 'Scaduto', color: 'var(--warning)', bg: 'var(--warning-light)' },
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const status = statusLabels[user?.subscriptionStatus ?? ''] ?? statusLabels.FREE;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Profilo
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Informazioni del tuo account.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
        }}
      >
        {user ? (
          <div className="space-y-5">
            {/* Avatar + Email */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
              >
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user.email}
                </p>
                <span
                  className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ background: status.bg, color: status.color }}
                >
                  {status.label}
                </span>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-default)' }} />

            {/* Details */}
            <dl className="grid gap-4 sm:grid-cols-2">
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Piano
                </dt>
                <dd className="mt-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {user.subscriptionStatus === 'ACTIVE' ? 'Pro' : 'Free'}
                </dd>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Crediti rimanenti
                </dt>
                <dd className="mt-1 text-lg font-bold" style={{ color: 'var(--accent)' }}>
                  {user.creditsRemaining}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="skeleton h-14 w-14 rounded-2xl" />
              <div className="space-y-2">
                <div className="skeleton h-4 w-40" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => api.auth.logout()}
        className="focus-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)',
          color: 'var(--error)',
        }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Esci dall&apos;account
      </button>
    </div>
  );
}
