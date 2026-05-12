import Link from 'next/link'
import { profile } from '@/content/profile'

const categories = [
  {
    href: '/movie',
    label: 'Movie',
    sub: 'Motion design & visual effects',
    color: '#3b82f6',
    num: '01',
  },
  {
    href: '/apps',
    label: 'Apps',
    sub: 'iOS & web application development',
    color: '#7c3aed',
    num: '02',
  },
  {
    href: '/model',
    label: 'Model',
    sub: 'Visual direction & archive',
    color: '#f43f5e',
    num: '03',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-24 pb-16">
      {/* Self-introduction */}
      <section className="mb-20 max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-8">
          Self Introduction
        </p>

        <h1 className="text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.02em] leading-[0.92] mb-8 text-[#f0f0f0]">
          {profile.name.split(' ')[0]}<br />
          <span className="text-[#2a2a2a]">——</span>
        </h1>

        {/* catchJa の \n を改行として表示 */}
        <p className="text-base text-[#606060] leading-relaxed mb-6 max-w-sm whitespace-pre-line">
          {profile.catchJa}
        </p>

        <p className="text-sm text-[#404040] leading-relaxed max-w-sm italic">
          {profile.catchEn}
        </p>

        <div className="flex flex-wrap gap-2 mt-8">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-[11px] font-mono border border-[rgba(255,255,255,0.07)] text-[#505050] rounded-full hover:border-[rgba(255,255,255,0.15)] hover:text-[#808080] transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Category cards */}
      <section>
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#303030] uppercase mb-6">
          Work
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
          {categories.map(({ href, label, sub, color, num }) => (
            <Link
              key={href}
              href={href}
              className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 min-h-[180px] flex flex-col justify-between overflow-hidden hover:border-[var(--border-hover)] transition-all duration-500"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{ background: `radial-gradient(circle at 30% 30%, ${color}08 0%, transparent 70%)` }}
              />

              <div className="relative z-10">
                <p className="font-mono text-[10px] text-[#303030] mb-4">{num}</p>
                <h2
                  className="text-2xl font-semibold mb-2 transition-colors duration-300"
                  style={{ color: '#c0c0c0' }}
                >
                  {label}
                </h2>
                <p className="text-xs text-[#404040] leading-relaxed">{sub}</p>
              </div>

              <div
                className="relative z-10 font-mono text-[10px] transition-colors duration-300 group-hover:opacity-100 opacity-30"
                style={{ color }}
              >
                View →
              </div>

              {/* Color accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, transparent, ${color}50, transparent)` }}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
