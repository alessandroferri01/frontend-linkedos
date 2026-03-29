'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

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
      <h1 className="text-2xl font-bold text-gray-900">Abbonamento</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Piano Free */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">€0<span className="text-base font-normal text-gray-500">/mese</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ 5 crediti</li>
            <li>✓ Generazione post AI</li>
            <li>✓ Storico post</li>
          </ul>
        </div>

        {/* Piano Pro */}
        <div className="rounded-xl border-2 border-blue-600 bg-white p-6 relative">
          <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
            Consigliato
          </span>
          <h2 className="text-lg font-semibold text-gray-900">Pro</h2>
          <p className="mt-1 text-3xl font-bold text-gray-900">€19<span className="text-base font-normal text-gray-500">/mese</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>✓ 100 crediti/mese</li>
            <li>✓ Generazione post AI</li>
            <li>✓ Storico post</li>
            <li>✓ Supporto prioritario</li>
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Reindirizzamento...' : 'Passa a Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
