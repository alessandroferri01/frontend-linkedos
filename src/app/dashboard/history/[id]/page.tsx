'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Post } from '@/types';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.posts
      .getById(id)
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : 'Errore nel caricamento'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCopy() {
    if (!post) return;
    await navigator.clipboard.writeText(post.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (!post || !confirm('Sei sicuro di voler eliminare questo post?')) return;
    try {
      await api.posts.delete(post.id);
      router.push('/dashboard/history');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella cancellazione');
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-5 w-32" />
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
        >
          <div className="space-y-2">
            <div className="skeleton h-5 w-2/3" />
            <div className="skeleton h-3 w-1/4" />
          </div>
          <div className="mt-6 space-y-3">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Torna allo storico
        </Link>
        <div
          className="animate-scale-in flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium"
          style={{ background: 'var(--error-light)', color: 'var(--error)' }}
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/dashboard/history"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
        style={{ color: 'var(--accent)' }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Torna allo storico
      </Link>

      {/* Post card */}
      <div
        className="overflow-hidden rounded-2xl border"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
      >
        {/* Header */}
        <div
          className="flex flex-wrap items-start justify-between gap-4 border-b px-5 py-5 sm:px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold sm:text-xl" style={{ color: 'var(--text-primary)' }}>
              {post.topic}
            </h1>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Generato il{' '}
              {new Date(post.createdAt).toLocaleDateString('it-IT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                borderColor: 'var(--border-default)',
                color: copied ? 'var(--success)' : 'var(--text-secondary)',
                background: copied ? 'var(--success-light)' : 'transparent',
              }}
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copiato!
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copia
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                borderColor: 'color-mix(in srgb, var(--error) 25%, transparent)',
                color: 'var(--error)',
              }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Elimina
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6 sm:px-6">
          <div
            className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.generatedContent}
          </div>
        </div>
      </div>
    </div>
  );
}
