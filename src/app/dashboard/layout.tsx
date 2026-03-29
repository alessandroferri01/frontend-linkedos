'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

const navItems = [
  { href: '/dashboard/generate', label: 'Genera Post', icon: '✏️' },
  { href: '/dashboard/history', label: 'Storico Post', icon: '📋' },
  { href: '/dashboard/profile', label: 'Profilo', icon: '👤' },
  { href: '/dashboard/billing', label: 'Abbonamento', icon: '💳' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              LinkedOS
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-3">
            <button
              onClick={() => api.auth.logout()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <span>🚪</span>
              Esci
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            LinkedOS
          </Link>
          <MobileMenu pathname={pathname} />
        </header>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <details className="relative">
      <summary className="cursor-pointer rounded-lg p-2 hover:bg-gray-100">
        <span className="text-xl">☰</span>
      </summary>
      <div className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <hr className="my-1" />
        <button
          onClick={() => api.auth.logout()}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <span>🚪</span>
          Esci
        </button>
      </div>
    </details>
  );
}
