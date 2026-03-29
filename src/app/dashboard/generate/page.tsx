'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostSchema, type GeneratePostFormData } from '@/lib/validations';
import { api } from '@/lib/api';
import { useState } from 'react';
import type { Post } from '@/types';

export default function GeneratePage() {
  const [result, setResult] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneratePostFormData>({
    resolver: zodResolver(generatePostSchema),
  });

  async function onSubmit(data: GeneratePostFormData) {
    setError('');
    setResult(null);
    try {
      const post = await api.posts.generate({ topic: data.topic });
      setResult(post);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nella generazione');
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRegenerate() {
    setResult(null);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Genera Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <textarea
            id="topic"
            rows={3}
            placeholder="Es: Come la leadership autentica trasforma i team tech"
            {...register('topic')}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.topic && (
            <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Generazione in corso...' : 'Genera'}
        </button>
      </form>

      {/* Loading skeleton */}
      {isSubmitting && (
        <div className="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Post Generato</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? '✓ Copiato!' : 'Copia'}
              </button>
              <button
                onClick={handleRegenerate}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Rigenera
              </button>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {result.generatedContent}
          </div>
        </div>
      )}
    </div>
  );
}
