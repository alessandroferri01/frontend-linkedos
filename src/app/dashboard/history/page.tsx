'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import type { Post } from '@/types';

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await api.posts.getAll();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) return;
    setDeletingId(id);
    try {
      await api.posts.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella cancellazione');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCopy(id: string, content: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
            Storico Post
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tutti i post che hai generato finora.
          </p>
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border p-6"
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/5" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
            Storico Post
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tutti i post che hai generato finora.
          </p>
        </div>
        {posts.length > 0 && (
          <span
            className="rounded-full border px-3 py-1 text-xs font-medium"
            style={{
              borderColor: 'var(--border-default)',
              color: 'var(--text-tertiary)',
            }}
          >
            {posts.length} post
          </span>
        )}
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

      {posts.length === 0 ? (
        <div
          className="rounded-2xl border p-12 text-center"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <svg className="h-7 w-7" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Nessun post generato ancora
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Vai alla pagina Genera per creare il tuo primo post.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-in-up rounded-2xl border transition-all duration-200 hover:shadow-md"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-default)',
                animationDelay: `${index * 60}ms`,
                animationFillMode: 'backwards',
              }}
            >
              {/* Header */}
              <div
                className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4 sm:px-6"
                style={{ borderColor: 'var(--border-default)' }}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {post.topic}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(post.createdAt).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(post.id, post.generatedContent)}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      borderColor: 'var(--border-default)',
                      color: copiedId === post.id ? 'var(--success)' : 'var(--text-secondary)',
                      background: copiedId === post.id ? 'var(--success-light)' : 'transparent',
                    }}
                  >
                    {copiedId === post.id ? (
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
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--error) 25%, transparent)',
                      color: 'var(--error)',
                    }}
                  >
                    {deletingId === post.id ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Elimino...
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Elimina
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Content */}
              <Link href={`/dashboard/history/${post.id}`} className="block px-5 py-4 sm:px-6 group/link">
                <p
                  className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {post.generatedContent}
                </p>
                <span
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium transition-colors group-hover/link:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  Leggi tutto
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
