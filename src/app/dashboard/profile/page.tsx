'use client';

import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profilo</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {user ? (
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Piano</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.subscriptionStatus}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Crediti rimanenti</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.creditsRemaining}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-gray-500">Caricamento profilo...</p>
        )}
      </div>

      <button
        onClick={() => api.auth.logout()}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Esci dall&apos;account
      </button>
    </div>
  );
}
