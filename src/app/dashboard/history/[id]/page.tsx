'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Post, LinkedInPostStats } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/components/ui/toast';

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [stats, setStats] = useState<LinkedInPostStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

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

  async function handlePublishToLinkedin() {
    if (!post) return;
    setPublishing(true);
    try {
      await api.linkedin.publishPost(post.id);
      setPost({ ...post, publishedToLinkedin: true, publishedAt: new Date().toISOString() });
      toast('Post pubblicato su LinkedIn!', 'success');
      loadStats(post.id);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Errore nella pubblicazione', 'error');
    } finally {
      setPublishing(false);
    }
  }

  async function loadStats(postId: string) {
    setStatsLoading(true);
    try {
      const data = await api.linkedin.getPostStats(postId);
      setStats(data);
    } catch {
      // Stats may not be available yet
    } finally {
      setStatsLoading(false);
    }
  }

  // Load stats if post is already published
  useEffect(() => {
    if (post?.publishedToLinkedin) {
      loadStats(post.id);
    }
  }, [post?.publishedToLinkedin, post?.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-5 w-32 rounded-lg" />
        <div
          className="overflow-hidden rounded-2xl border"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
        >
          <div className="border-b px-5 py-5 sm:px-6" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-start gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-2/3" />
                <div className="flex gap-3">
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3 px-5 py-6 sm:px-6">
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
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:gap-2.5"
          style={{ color: 'var(--accent)' }}
        >
          <svg className="h-4 w-4 transition-transform duration-200 hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

  const words = wordCount(post.generatedContent);
  const readMins = Math.ceil(words / 200);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/history"
        className="group inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:gap-2.5"
        style={{ color: 'var(--accent)' }}
      >
        <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Torna allo storico
      </Link>

      {/* Post card */}
      <div
        className="glow-border overflow-hidden rounded-2xl ai-glow"
        style={{ background: 'var(--bg-secondary)' }}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* AI badge */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold sm:text-xl" style={{ color: 'var(--text-primary)' }}>
                {post.topic}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                  </svg>
                  {words} parole
                </span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readMins} min lettura
                </span>
              </div>
            </div>
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
            {user?.linkedinConnected && !post.publishedToLinkedin && (
              <button
                onClick={handlePublishToLinkedin}
                disabled={publishing}
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                style={{ background: '#0A66C2' }}
              >
                {publishing ? (
                  'Pubblicazione...'
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Pubblica su LinkedIn
                  </>
                )}
              </button>
            )}
            {post.publishedToLinkedin && (
              <span
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold"
                style={{ background: 'color-mix(in srgb, #0A66C2 15%, transparent)', color: '#0A66C2' }}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Pubblicato
              </span>
            )}
          </div>
        </div>

        {/* LinkedIn Stats */}
        {post.publishedToLinkedin && (
          <div
            className="border-b px-5 py-4 sm:px-6"
            style={{ borderColor: 'var(--border-default)', background: 'color-mix(in srgb, #0A66C2 3%, var(--bg-secondary))' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4" style={{ color: '#0A66C2' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A66C2' }}>
                Statistiche LinkedIn
              </span>
              {post.publishedAt && (
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                  — Pubblicato il {new Date(post.publishedAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
            {statsLoading ? (
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                    <div className="skeleton mx-auto mb-1 h-4 w-4 rounded" />
                    <div className="skeleton mx-auto h-6 w-8" />
                    <div className="skeleton mx-auto mt-1 h-2 w-12" />
                  </div>
                ))}
              </div>
            ) : stats ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="h-4 w-4" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.likeCount}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Like</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.commentCount}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Commenti</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <svg className="h-4 w-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{stats.shareCount}</p>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Condivisioni</p>
                </div>
              </div>
            ) : (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Le statistiche saranno disponibili dopo qualche ora dalla pubblicazione.
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative px-5 py-6 sm:px-6">
          {/* Decorative side accent */}
          <div
            className="absolute bottom-6 left-0 top-6 w-0.5 rounded-full"
            style={{
              background: 'linear-gradient(to bottom, var(--accent), #7c3aed, transparent)',
              opacity: 0.3,
            }}
          />
          <div className="pl-4">
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.generatedContent}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between border-t px-5 py-3 sm:px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            <svg className="h-3 w-3" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Generato con LinkedOS AI
          </span>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-200 hover:gap-1.5"
            style={{ color: 'var(--accent)' }}
          >
            Genera un nuovo post
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
