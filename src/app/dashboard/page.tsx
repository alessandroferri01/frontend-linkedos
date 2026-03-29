import Link from 'next/link';

const cards = [
  {
    href: '/dashboard/generate',
    title: 'Genera Post',
    desc: 'Crea un nuovo post LinkedIn con l\'AI',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, var(--accent), #7c3aed)',
  },
  {
    href: '/dashboard/history',
    title: 'Storico Post',
    desc: 'Visualizza i post generati in precedenza',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    href: '/dashboard/billing',
    title: 'Piano',
    desc: 'Gestisci il tuo abbonamento e crediti',
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Benvenuto in LinkedOS. Cosa vuoi fare oggi?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            className={`animate-fade-in-up stagger-${i + 1} group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]`}
            style={{
              background: 'var(--bg-secondary)',
              borderColor: 'var(--border-default)',
            }}
          >
            <div
              className="mb-4 inline-flex rounded-xl p-3 text-white"
              style={{ background: card.gradient }}
            >
              {card.icon}
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {card.title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {card.desc}
            </p>
            <div
              className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-5 transition-all duration-300 group-hover:opacity-10"
              style={{ background: card.gradient }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
