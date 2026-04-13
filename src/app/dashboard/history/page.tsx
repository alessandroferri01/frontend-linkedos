'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import type { Post, Pagination, PostsQuery, LinkedInPostStats } from '@/types';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/components/ui/toast';

function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function readingTime(text: string) {
  const mins = Math.ceil(wordCount(text) / 200);
  return `${mins} min`;
}

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Più recenti' },
  { value: 'createdAt:asc', label: 'Meno recenti' },
  { value: 'topic:asc', label: 'Topic A→Z' },
  { value: 'topic:desc', label: 'Topic Z→A' },
] as const;

const POSTS_PER_PAGE = 10;

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [statsId, setStatsId] = useState<string | null>(null);
  const [stats, setStats] = useState<LinkedInPostStats | null>(null);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

  // Filters & sorting
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt:desc');
  const [page, setPage] = useState(1);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const loadPosts = useCallback(async (query: PostsQuery) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.posts.getAll(query);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  }, []);

  // Build query from current state
  const buildQuery = useCallback(
    (overrides?: Partial<PostsQuery>): PostsQuery => {
      const [sortBy, sortOrder] = sort.split(':') as [PostsQuery['sortBy'], PostsQuery['sortOrder']];
      return {
        page,
        limit: POSTS_PER_PAGE,
        sortBy,
        sortOrder,
        search: search.trim() || undefined,
        ...overrides,
      };
    },
    [sort, page, search],
  );

  // Initial load + reload on sort/page changes
  useEffect(() => {
    loadPosts(buildQuery());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, page]);

  // Debounced search
  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      loadPosts(buildQuery({ search: value.trim() || undefined, page: 1 }));
    }, 400);
  }

  function handleSortChange(value: string) {
    setSort(value);
    setPage(1);
  }

  async function handleDelete(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) return;
    setDeletingId(id);
    try {
      await api.posts.delete(id);
      // Reload current page
      loadPosts(buildQuery());
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

  async function handlePublishToLinkedin(postId: string) {
    setPublishingId(postId);
    try {
      await api.linkedin.publishPost(postId);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, publishedToLinkedin: true, publishedAt: new Date().toISOString() } : p
      ));
      toast('Post pubblicato su LinkedIn!', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Errore nella pubblicazione', 'error');
    } finally {
      setPublishingId(null);
    }
  }

  async function handleViewStats(postId: string) {
    if (statsId === postId) {
      setStatsId(null);
      setStats(null);
      return;
    }
    setStatsId(postId);
    setStats(null);
    try {
      const data = await api.linkedin.getPostStats(postId);
      setStats(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Errore nel caricamento statistiche', 'error');
      setStatsId(null);
    }
  }

  const showingFrom = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const showingTo = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

  return (
    <div className="min-w-0 space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)', boxShadow: '0 0 20px var(--accent-glow)' }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
              Storico Post
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              La tua libreria di contenuti AI
            </p>
          </div>
        </div>
        {pagination && pagination.total > 0 && (
          <div
            className="flex items-center gap-2 rounded-full border px-3.5 py-1.5"
            style={{ borderColor: 'var(--border-default)', background: 'var(--bg-tertiary)' }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}
            />
            <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {pagination.total} post generati
            </span>
          </div>
        )}
      </div>

      {/* Search & Sort Bar */}
      <div
        className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Cerca per topic o contenuto..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="focus-ring w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm transition-all duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 transition-colors hover:opacity-70"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative sm:shrink-0">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-4.5L16.5 16.5m0 0L12 12m4.5 4.5V7.5" />
          </svg>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="focus-ring w-full appearance-none rounded-xl border py-2.5 pl-10 pr-8 text-sm font-medium transition-all duration-200"
            style={{
              background: 'var(--bg-tertiary)',
              borderColor: 'var(--border-default)',
              color: 'var(--text-primary)',
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
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

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border"
              style={{
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-default)',
                opacity: 1 - i * 0.15,
              }}
            >
              <div className="flex items-center gap-3 px-5 py-4 sm:px-6">
                <div className="skeleton h-9 w-9 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="flex gap-3">
                    <div className="skeleton h-3 w-24" />
                    <div className="skeleton h-3 w-16" />
                  </div>
                </div>
              </div>
              <div className="border-t px-5 py-4 sm:px-6" style={{ borderColor: 'var(--border-default)' }}>
                <div className="space-y-2">
                  <div className="skeleton h-3.5 w-full" />
                  <div className="skeleton h-3.5 w-5/6" />
                  <div className="skeleton h-3.5 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 && !search ? (
        /* Empty state - no posts at all */
        <div
          className="glow-border relative overflow-hidden rounded-2xl p-12 text-center ai-glow"
          style={{ background: 'var(--bg-secondary)' }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <svg className="absolute inset-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="empty-glow" cx="50%" cy="40%" r="50%">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#empty-glow)" />
            </svg>
          </div>
          <div className="relative">
            <div className="relative mx-auto mb-5 h-20 w-20">
              <div
                className="absolute inset-0 animate-spin-slow rounded-full"
                style={{ border: '1px dashed var(--accent)', opacity: 0.3 }}
              />
              <div
                className="absolute inset-3 flex items-center justify-center rounded-2xl"
                style={{ background: 'var(--accent-light)' }}
              >
                <svg className="h-7 w-7" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Nessun post generato ancora
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm" style={{ color: 'var(--text-tertiary)' }}>
              La tua libreria è vuota. Genera il tuo primo post con l&apos;AI per vederlo apparire qui.
            </p>
            <Link
              href="/dashboard/generate"
              className="focus-ring mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Genera il primo post
            </Link>
          </div>
        </div>
      ) : posts.length === 0 && search ? (
        /* Empty search results */
        <div
          className="rounded-2xl border p-10 text-center"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
        >
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <svg className="h-6 w-6" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Nessun risultato per &ldquo;{search}&rdquo;
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Prova a cercare con altri termini.
          </p>
          <button
            onClick={() => handleSearchChange('')}
            className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancella ricerca
          </button>
        </div>
      ) : (
        <>
          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in-up group/card overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
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
                  <div className="flex min-w-0 items-start gap-3">
                    {/* Index badge */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 group-hover/card:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                        color: 'white',
                        boxShadow: '0 0 12px var(--accent-glow)',
                      }}
                    >
                      {pagination
                        ? String(pagination.total - ((pagination.page - 1) * pagination.limit + index)).padStart(2, '0')
                        : String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {post.topic}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {new Date(post.createdAt).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                          </svg>
                          {wordCount(post.generatedContent)} parole
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {readingTime(post.generatedContent)}
                        </span>
                        {post.publishedToLinkedin && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ background: 'color-mix(in srgb, #0A66C2 15%, transparent)', color: '#0A66C2' }}
                          >
                            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 opacity-70 transition-opacity duration-200 group-hover/card:opacity-100">
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
                    {user?.linkedinConnected && !post.publishedToLinkedin && (
                      <button
                        onClick={() => handlePublishToLinkedin(post.id)}
                        disabled={publishingId === post.id}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
                        style={{ background: '#0A66C2' }}
                      >
                        {publishingId === post.id ? (
                          <>
                            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Pubblico...
                          </>
                        ) : (
                          <>
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </>
                        )}
                      </button>
                    )}
                    {post.publishedToLinkedin && (
                      <button
                        onClick={() => handleViewStats(post.id)}
                        className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                        style={{
                          borderColor: statsId === post.id ? '#0A66C2' : 'var(--border-default)',
                          color: statsId === post.id ? '#0A66C2' : 'var(--text-secondary)',
                          background: statsId === post.id ? 'color-mix(in srgb, #0A66C2 10%, transparent)' : 'transparent',
                        }}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                        Stats
                      </button>
                    )}
                  </div>
                </div>
                {/* LinkedIn Stats Panel */}
                {statsId === post.id && (
                  <div
                    className="animate-fade-in border-b px-5 py-4 sm:px-6"
                    style={{ borderColor: 'var(--border-default)', background: 'color-mix(in srgb, #0A66C2 3%, var(--bg-secondary))' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="h-4 w-4" style={{ color: '#0A66C2' }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#0A66C2' }}>
                        Statistiche LinkedIn
                      </span>
                    </div>
                    {stats ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg className="h-4 w-4" style={{ color: 'var(--error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                          </div>
                          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                            {stats.likeCount}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                            Like
                          </p>
                        </div>
                        <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                            </svg>
                          </div>
                          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                            {stats.commentCount}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                            Commenti
                          </p>
                        </div>
                        <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <svg className="h-4 w-4" style={{ color: 'var(--success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                            </svg>
                          </div>
                          <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                            {stats.shareCount}
                          </p>
                          <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                            Condivisioni
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'var(--bg-tertiary)' }}>
                            <div className="skeleton mx-auto mb-1 h-4 w-4 rounded" />
                            <div className="skeleton mx-auto h-6 w-8" />
                            <div className="skeleton mx-auto mt-1 h-2 w-12" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Content Preview */}
                <Link href={`/dashboard/history/${post.id}`} className="group/link relative block px-5 py-4 sm:px-6">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 3%, transparent), transparent)',
                    }}
                  />
                  <p
                    className="relative line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {post.generatedContent}
                  </p>
                  <span
                    className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 group-hover/link:gap-2.5"
                    style={{ color: 'var(--accent)' }}
                  >
                    Leggi tutto
                    <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div
              className="flex flex-col items-center gap-4 rounded-2xl border px-5 py-4 sm:flex-row sm:justify-between"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
            >
              {/* Info */}
              <span className="text-xs tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                {showingFrom}–{showingTo} di {pagination.total} post
              </span>

              {/* Page buttons */}
              <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, current, and neighbors
                    if (p === 1 || p === pagination.totalPages) return true;
                    if (Math.abs(p - page) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | 'dots')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('dots');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === 'dots' ? (
                      <span key={`dots-${i}`} className="px-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                          page === item ? 'text-white' : 'border'
                        }`}
                        style={
                          page === item
                            ? {
                                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                                boxShadow: '0 0 12px var(--accent-glow)',
                              }
                            : {
                                borderColor: 'var(--border-default)',
                                color: 'var(--text-secondary)',
                              }
                        }
                      >
                        {item}
                      </button>
                    ),
                  )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                  style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
