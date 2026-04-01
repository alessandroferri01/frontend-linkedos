'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostSchema, type GeneratePostFormData } from '@/lib/validations';
import { api } from '@/lib/api';
import { useState, useEffect, useRef } from 'react';
import type { Post } from '@/types';
import { useAuthStore } from '@/stores/auth';

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Breve', desc: '100-200 parole', icon: '⚡', pro: false },
  { value: 'medium', label: 'Medio', desc: '200-350 parole', icon: '✦', pro: false },
  { value: 'long', label: 'Lungo', desc: '350-500 parole', icon: '◆', pro: true },
] as const;

type PostLength = typeof LENGTH_OPTIONS[number]['value'];

/* ─── AI Neural Background ─── */
function NeuralBackground({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="glow1" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={active ? 0.08 : 0.03} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow2" cx="70%" cy="70%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity={active ? 0.06 : 0.02} />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#glow1)" />
        <rect width="100%" height="100%" fill="url(#glow2)" />
        {/* Neural nodes */}
        {active && (
          <g>
            {[
              { cx: '15%', cy: '20%', delay: '0s' },
              { cx: '85%', cy: '15%', delay: '0.5s' },
              { cx: '70%', cy: '80%', delay: '1s' },
              { cx: '25%', cy: '75%', delay: '1.5s' },
              { cx: '50%', cy: '40%', delay: '0.3s' },
              { cx: '40%', cy: '60%', delay: '0.8s' },
            ].map((n, i) => (
              <circle
                key={i}
                cx={n.cx}
                cy={n.cy}
                r="2"
                fill="var(--accent)"
                opacity="0.4"
                style={{ animation: `neural-pulse 2s ease-in-out ${n.delay} infinite` }}
              />
            ))}
            {/* Data streams */}
            {[
              { d: 'M15,20 Q50,10 85,15', delay: '0s' },
              { d: 'M85,15 Q90,50 70,80', delay: '0.7s' },
              { d: 'M25,75 Q30,50 50,40', delay: '1.4s' },
              { d: 'M50,40 Q60,30 85,15', delay: '0.3s' },
            ].map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.5"
                opacity="0.3"
                strokeDasharray="4 8"
                style={{ animation: `data-stream 3s linear ${s.delay} infinite` }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

/* ─── Generating Animation ─── */
function GeneratingOverlay() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-12">
      {/* AI Core animation */}
      <div className="relative mb-8 h-28 w-28">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full animate-spin-slow"
          style={{
            border: '1px solid transparent',
            borderTopColor: 'var(--accent)',
            borderRightColor: 'rgba(124, 58, 237, 0.5)',
            opacity: 0.6,
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-3 rounded-full"
          style={{
            border: '1px solid transparent',
            borderBottomColor: '#06b6d4',
            borderLeftColor: 'var(--accent)',
            opacity: 0.4,
            animation: 'spin-slow 3s linear infinite reverse',
          }}
        />
        {/* Inner glow */}
        <div
          className="absolute inset-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
            opacity: 0.15,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
        {/* Core */}
        <div
          className="absolute inset-9 rounded-full"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
            boxShadow: '0 0 30px var(--accent-glow)',
          }}
        />
        {/* Orbiting particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-orbit">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: '#06b6d4', boxShadow: '0 0 6px #06b6d4' }}
            />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-orbit-reverse">
            <div
              className="h-1 w-1 rounded-full"
              style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}
            />
          </div>
        </div>
      </div>

      <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
        L&apos;AI sta elaborando{dots}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
        Analisi del topic e generazione del contenuto
      </p>

      {/* Progress line */}
      <div
        className="mt-6 h-0.5 w-48 overflow-hidden rounded-full"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, var(--accent), #7c3aed, #06b6d4)',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 1.5s ease infinite',
            width: '60%',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Typewriter result ─── */
function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const speed = Math.max(5, Math.min(20, 3000 / text.length));
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="whitespace-pre-wrap text-sm leading-relaxed sm:text-base"
        style={{ color: 'var(--text-primary)' }}
      >
        {displayed}
        {!done && (
          <span
            className="animate-type-cursor inline-block h-5 w-0.5 translate-y-0.5 align-middle"
            style={{ background: 'var(--accent)' }}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function GeneratePage() {
  const [result, setResult] = useState<Post | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState<PostLength>('medium');
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isPro = user?.subscriptionStatus === 'ACTIVE';

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
    watch,
  } = useForm<GeneratePostFormData>({
    resolver: zodResolver(generatePostSchema),
  });

  const topicValue = watch('topic');

  async function onSubmit(data: GeneratePostFormData) {
    setError('');
    setResult(null);
    try {
      const post = await api.posts.generate({
        topic: data.topic,
        length: isPro ? length : 'medium',
      });
      setResult(post);
      api.auth.me().then(setUser).catch(() => {});
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)', boxShadow: '0 0 20px var(--accent-glow)' }}
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM15 2.25l.405 1.42a2.47 2.47 0 001.927 1.926l1.418.406-1.418.405a2.47 2.47 0 00-1.927 1.927L15 9.75l-.405-1.416a2.47 2.47 0 00-1.927-1.927L11.25 6l1.418-.405a2.47 2.47 0 001.927-1.927L15 2.25z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
            AI Generator
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            Powered by intelligenza artificiale avanzata
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div
        className={`glow-border relative rounded-2xl p-5 sm:p-6 ai-glow transition-all duration-500 ${isSubmitting ? 'scan-line' : ''}`}
        style={{
          background: 'var(--bg-secondary)',
        }}
      >
        <NeuralBackground active={isSubmitting} />

        {!isSubmitting ? (
          <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-5">
            {/* Topic Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="topic"
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  Descrivi il tuo post
                </label>
                {topicValue && (
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-tertiary)' }}>
                    {topicValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <textarea
                  id="topic"
                  rows={4}
                  placeholder="Es: Come la leadership autentica trasforma i team tech nel 2026..."
                  {...register('topic')}
                  className="focus-ring w-full resize-none rounded-xl border px-4 py-3 text-sm leading-relaxed transition-all duration-300 placeholder:opacity-40"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: formErrors.topic ? 'var(--error)' : 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              {formErrors.topic && (
                <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--error)' }}>
                  {formErrors.topic.message}
                </p>
              )}
            </div>

            {/* Length Selector (Pro feature) */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                </svg>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Lunghezza
                </span>
                {!isPro && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)', color: 'white' }}
                  >
                    Pro
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {LENGTH_OPTIONS.map((opt) => {
                  const locked = opt.pro && !isPro;
                  const selected = length === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && setLength(opt.value)}
                      className={`focus-ring relative flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                        locked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      style={{
                        borderColor: selected && !locked ? 'var(--accent)' : 'var(--border-default)',
                        background: selected && !locked ? 'var(--accent-light)' : 'var(--bg-tertiary)',
                      }}
                    >
                      <span className="text-lg">{opt.icon}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: selected && !locked ? 'var(--accent)' : 'var(--text-primary)' }}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                        {opt.desc}
                      </span>
                      {locked && (
                        <svg className="absolute right-2 top-2 h-3 w-3" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {!isPro && (
                <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  Passa al piano <strong style={{ color: 'var(--accent)' }}>Pro</strong> per sbloccare post lunghi e parametri avanzati.
                </p>
              )}
            </div>

            {/* Error */}
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                boxShadow: '0 0 30px var(--accent-glow)',
              }}
            >
              {/* Shine effect on hover */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM15 2.25l.405 1.42a2.47 2.47 0 001.927 1.926l1.418.406-1.418.405a2.47 2.47 0 00-1.927 1.927L15 9.75l-.405-1.416a2.47 2.47 0 00-1.927-1.927L11.25 6l1.418-.405a2.47 2.47 0 001.927-1.927L15 2.25z" />
              </svg>
              Genera con AI
            </button>
          </form>
        ) : (
          <GeneratingOverlay />
        )}
      </div>

      {/* Result */}
      {result && (
        <div
          className="animate-fade-in-up glow-border overflow-hidden rounded-2xl ai-glow"
          style={{ background: 'var(--bg-secondary)' }}
        >
          {/* Header */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-6"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                  style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <div
                  className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2"
                  style={{ background: 'var(--success)', borderColor: 'var(--bg-secondary)' }}
                />
              </div>
              <div>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Post Generato
                </h2>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  Pronto per essere pubblicato
                </p>
              </div>
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
                style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Nuovo
              </button>
            </div>
          </div>
          {/* Content with typewriter */}
          <div className="p-5 sm:p-6">
            <TypewriterText text={result.generatedContent} />
          </div>
        </div>
      )}
    </div>
  );
}
