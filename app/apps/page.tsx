import { MediaCard } from '@/components/ui/MediaCard'
import { appWorks as apps, pmSkills as pmWorks } from '@/content/apps'

export default function AppsPage() {
  const featured = apps.find(a => a.featured)!
  const rest = apps.filter(a => !a.featured)

  return (
    <main className="min-h-screen px-8 md:px-16 lg:px-24 pt-24 pb-20">
      {/* Header */}
      <div className="mb-16 max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">02</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f0f0f0] mb-4">
          Apps
        </h1>
        <p className="text-sm text-[#505050] leading-relaxed">
          iOS・Web アプリケーション開発。企画から設計・実装・リリースまでをエンドツーエンドで担当。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Featured app */}
        <div className="md:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col min-h-[360px] hover:border-[var(--border-hover)] transition-all duration-500">
          {/* Screenshot placeholder */}
          <div className="relative flex-1">
            <MediaCard
              type={featured.type}
              src={featured.src}
              className="h-full border-0 rounded-none"
            />
          </div>
          {/* Info */}
          <div className="p-6 border-t border-[var(--border)]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-[10px] text-[#383838] mb-1 tracking-widest">{featured.year}</p>
                <h2 className="text-xl font-semibold text-[#f0f0f0]">{featured.title}</h2>
              </div>
              <span className="px-2 py-1 text-[10px] font-mono bg-[var(--surface-2)] text-[#505050] rounded-lg border border-[var(--border)]">
                {featured.status}
              </span>
            </div>
            <p className="text-xs text-[#505050] leading-relaxed mb-4">{featured.description}</p>
            <div className="flex flex-wrap gap-2">
              {featured.tech.map(t => (
                <span key={t} className="px-2 py-1 text-[10px] font-mono text-[#7c3aed] bg-[rgba(124,58,237,0.08)] rounded-md">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PM card */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 flex-1">
            <p className="font-mono text-[10px] text-[#383838] uppercase tracking-[0.3em] mb-4">
              Product Management
            </p>
            <div className="space-y-4">
              {pmWorks.map(w => (
                <div key={w.label} className="border-b border-[rgba(255,255,255,0.04)] pb-4 last:border-0 last:pb-0">
                  <p className="text-sm text-[#c0c0c0] font-medium mb-1">{w.label}</p>
                  <p className="text-xs text-[#404040]">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Second app */}
          {rest.map(app => (
            <div
              key={app.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-[#f0f0f0]">{app.title}</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[var(--surface-2)] text-[#505050] rounded border border-[var(--border)]">
                  {app.status}
                </span>
              </div>
              <p className="text-xs text-[#404040] mb-3 leading-relaxed">{app.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {app.tech.map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] font-mono text-[#7c3aed] bg-[rgba(124,58,237,0.08)] rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 font-mono text-[10px] text-[#282828] text-center">
        スクリーンショットを追加するには <code className="text-[#383838]">public/media/</code> に画像を置き src を指定してください
      </p>
    </main>
  )
}
