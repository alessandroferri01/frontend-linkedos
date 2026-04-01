'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { AIProfile } from '@/types';

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  FREE: { label: 'Free', color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)' },
  ACTIVE: { label: 'Attivo', color: 'var(--success)', bg: 'var(--success-light)' },
  PAST_DUE: { label: 'Scaduto', color: 'var(--warning)', bg: 'var(--warning-light)' },
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const status = statusLabels[user?.subscriptionStatus ?? ''] ?? statusLabels.FREE;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  // AI Profile state
  const [aiProfile, setAiProfile] = useState<AIProfile | null>(null);
  const [aiEditing, setAiEditing] = useState(false);
  const [aiSaving, setAiSaving] = useState(false);
  const [profession, setProfession] = useState('');
  const [tone, setTone] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [writingStyle, setWritingStyle] = useState('');

  useEffect(() => {
    api.auth.getAIProfile().then((profile) => {
      setAiProfile(profile);
      setProfession(profile.profession ?? '');
      setTone(profile.tone ?? '');
      setTargetAudience(profile.targetAudience ?? '');
      setWritingStyle(profile.writingStyle ?? '');
    }).catch(() => {});
  }, []);

  const handleEdit = () => {
    setFirstName(user?.firstName ?? '');
    setLastName(user?.lastName ?? '');
    setPhone(user?.phone ?? '');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleAiEdit = () => {
    setProfession(aiProfile?.profession ?? '');
    setTone(aiProfile?.tone ?? '');
    setTargetAudience(aiProfile?.targetAudience ?? '');
    setWritingStyle(aiProfile?.writingStyle ?? '');
    setAiEditing(true);
  };

  const handleAiCancel = () => {
    setAiEditing(false);
  };

  const handleAiSave = async () => {
    setAiSaving(true);
    try {
      const updated = await api.auth.updateAIProfile({
        profession: profession || undefined,
        tone: tone || undefined,
        targetAudience: targetAudience || undefined,
        writingStyle: writingStyle || undefined,
      });
      setAiProfile(updated);
      setAiEditing(false);
    } catch {
      // errore gestito globalmente
    } finally {
      setAiSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.auth.updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
      });
      updateUser(updated);
      setEditing(false);
    } catch {
      // toast di errore gestito globalmente
    } finally {
      setSaving(false);
    }
  };

  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ');

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
                {(user.firstName ?? user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                {displayName && (
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {displayName}
                  </p>
                )}
                <p className={displayName ? 'text-sm' : 'font-semibold'} style={{ color: displayName ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
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

            {/* Informazioni personali */}
            {!editing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Informazioni personali
                  </h2>
                  <button
                    onClick={handleEdit}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--accent)',
                    }}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Modifica
                  </button>
                </div>
                <dl className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                    <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Nome</dt>
                    <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user.firstName || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                    </dd>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                    <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Cognome</dt>
                    <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user.lastName || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                    </dd>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                    <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Telefono</dt>
                    <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user.phone || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Modifica informazioni
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Nome</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      maxLength={50}
                      className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                      style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="Il tuo nome"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Cognome</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      maxLength={50}
                      className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                      style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="Il tuo cognome"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Telefono</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                      style={{
                        background: 'var(--bg-primary)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      placeholder="Il tuo telefono"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{ background: 'var(--accent)' }}
                  >
                    {saving ? 'Salvataggio...' : 'Salva'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="focus-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Annulla
                  </button>
                </div>
              </div>
            )}

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

      {/* Personalizzazione AI */}
      <div
        className="rounded-2xl border p-6"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="space-y-5">
          {!aiEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                    Personalizzazione AI
                  </h2>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Questi dati vengono usati per personalizzare i post generati.
                  </p>
                </div>
                <button
                  onClick={handleAiEdit}
                  className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--accent)',
                  }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Modifica
                </button>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Professione</dt>
                  <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {aiProfile?.profession || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </dd>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Tono</dt>
                  <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {aiProfile?.tone || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </dd>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Target Audience</dt>
                  <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {aiProfile?.targetAudience || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </dd>
                </div>
                <div className="rounded-xl p-4" style={{ background: 'var(--bg-tertiary)' }}>
                  <dt className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Stile di Scrittura</dt>
                  <dd className="mt-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {aiProfile?.writingStyle || <span style={{ color: 'var(--text-tertiary)' }}>—</span>}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                Modifica personalizzazione AI
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Professione</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    maxLength={100}
                    className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="es. Software Engineer"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Tono</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    maxLength={50}
                    className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="es. Professionale, Informale"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    maxLength={200}
                    className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="es. Developer, Recruiter, Manager"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Stile di Scrittura</label>
                  <input
                    type="text"
                    value={writingStyle}
                    onChange={(e) => setWritingStyle(e.target.value)}
                    maxLength={100}
                    className="focus-ring w-full rounded-xl border px-3 py-2 text-sm transition-colors"
                    style={{
                      background: 'var(--bg-primary)',
                      borderColor: 'var(--border-default)',
                      color: 'var(--text-primary)',
                    }}
                    placeholder="es. Storytelling, Educativo"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAiSave}
                  disabled={aiSaving}
                  className="focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{ background: 'var(--accent)' }}
                >
                  {aiSaving ? 'Salvataggio...' : 'Salva'}
                </button>
                <button
                  onClick={handleAiCancel}
                  disabled={aiSaving}
                  className="focus-ring inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
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
