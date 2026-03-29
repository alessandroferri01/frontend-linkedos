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
    reset,
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

  function handleNew() {
    setResult(null);
    setCopied(false);
    reset();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Genera Post
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Inserisci un topic e l&apos;AI creerà un post LinkedIn professionale per te.
        </p>
      </div>

      {/* Form Card */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-default)',
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="topic"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Topic
            </label>
            <textarea
              id="topic"
              rows={3}
              placeholder="Es: Come la leadership autentica trasforma i team tech"
              {...register('topic')}
              className="focus-ring w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed transition-all duration-200 placeholder:opacity-40"
              style={{
                background: 'var(--bg-tertiary)',
                borderColor: errors.topic ? 'var(--error)' : 'var(--border-default)',
                color: 'var(--text-primary)',
              }}
            />
            {errors.topic && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--error)' }}>
                {errors.topic.message}
              </p>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="focus-ring inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
              boxShadow: isSubmitting ? 'none' : 'var(--shadow-glow)',
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generazione in corso...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Genera
              </>
            )}
          </button>
        </form>
      </div>

      {/* Loading skeleton */}
      {isSubmitting && (
        <div
          className="animate-fade-in space-y-3 rounded-2xl border p-6"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton mt-2 h-4 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className="animate-fade-in-up rounded-2xl border overflow-hidden"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
          }}
        >
          {/* Header */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                Post Generato
              </h2>
            </div>
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
                onClick={handleRegenerate}
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Rigenera
              </button>
              <button
                onClick={handleNew}
                className="focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent)' }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuovo
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="p-5 sm:p-6">
            <div
              className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
              style={{ color: 'var(--text-primary)' }}
            >
              {result.generatedContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
