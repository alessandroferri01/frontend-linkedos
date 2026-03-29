'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setError('');
    try {
      await api.auth.login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-40 -top-40 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-15 blur-3xl"
          style={{ background: '#a855f7' }}
        />
      </div>

      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="animate-fade-in-up relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 block text-center">
          <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            LinkedOS
          </span>
        </Link>

        {/* Card */}
        <div
          className="rounded-2xl border p-6 shadow-lg sm:p-8"
          style={{
            background: 'var(--bg-secondary)',
            borderColor: 'var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Bentornato
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Accedi al tuo account per continuare
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@esempio.com"
                  {...register('email')}
                  className="focus-ring w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:opacity-50"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: errors.email ? 'var(--error)' : 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--error)' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="focus-ring w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 placeholder:opacity-50"
                  style={{
                    background: 'var(--bg-tertiary)',
                    borderColor: errors.password ? 'var(--error)' : 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--error)' }}>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
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
                  Accesso in corso...
                </>
              ) : (
                'Accedi'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Non hai un account?{' '}
          <Link
            href="/register"
            className="font-semibold transition-colors hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}
