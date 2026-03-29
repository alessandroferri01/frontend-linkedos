'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Post } from '@/types';

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  async function handleCopy(content: string) {
    await navigator.clipboard.writeText(content);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Storico Post</h1>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-6">
            <div className="h-4 w-1/3 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-full rounded bg-gray-200" />
            <div className="mt-2 h-4 w-5/6 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Storico Post</h1>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">Nessun post generato ancora.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{post.topic}</p>
                  <p className="text-xs text-gray-500">
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
                    onClick={() => handleCopy(post.generatedContent)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Copia
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === post.id ? 'Eliminazione...' : 'Elimina'}
                  </button>
                </div>
              </div>
              <p className="line-clamp-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {post.generatedContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
