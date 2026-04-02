'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    exact: true,
  },
  {
    href: '/dashboard/generate',
    label: 'Genera',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/history',
    label: 'Storico',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/billing',
    label: 'Piano',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/profile',
    label: 'Profilo',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {});
  }, [setUser]);

  function isActive(item: typeof navItems[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-65 shrink-0 flex-col border-r md:flex"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
      >
        <div
          className="flex h-16 items-center gap-2 border-b px-6"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
          >
            L
          </div>
          <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            LinkedOS
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active ? '' : 'hover:translate-x-0.5'
                }`}
                style={{
                  background: active ? 'var(--accent-light)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                <span
                  className="transition-colors duration-200"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}
                >
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <div
                    className="ml-auto h-1.5 w-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t p-3" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Tema
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={() => api.auth.logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-0.5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Esci
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-x-clip">
        {/* Mobile top bar */}
        <header
          className="glass fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, var(--accent), #7c3aed)' }}
            >
              L
            </div>
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              LinkedOS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-xl p-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div
            className="animate-fade-in-down fixed left-0 right-0 top-14 z-30 border-b p-3 md:hidden"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
          >
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
                  style={{
                    background: active ? 'var(--accent-light)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => api.auth.logout()}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: 'var(--error)' }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Esci
            </button>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 p-4 pt-18 pb-20 sm:p-6 sm:pt-20 md:pt-6 md:pb-6">
          <div className="animate-fade-in mx-auto max-w-4xl">{children}</div>
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="glass fixed bottom-0 left-0 right-0 z-30 flex border-t md:hidden"
          style={{ borderColor: 'var(--border-default)' }}
        >
          {navItems.slice(0, 4).map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
                style={{ color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
