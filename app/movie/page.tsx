'use client'
import { useState } from 'react'
import { MediaCard } from '@/components/ui/MediaCard'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { movieWorks as works } from '@/content/movie'

export default function MoviePage() {
  const [selected, setSelected] = useState<WorkDetail | null>(null)
  const featured = works.find(w => w.featured)
  const rest = works.filter(w => !w.featured)

  return (
    <main className="min-h-screen px-8 md:px-16 lg:px-24 pt-24 pb-20">
      <div className="mb-16 max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">01</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f0f0f0] mb-4">
          Movie
        </h1>
        <p className="text-sm text-[#505050] leading-relaxed">
          After Effects を中心とした映像制作。モーショングラフィックス、VFX、タイトルシーケンス。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {featured && (
          <MediaCard
            {...featured}
            className="md:col-span-8 min-h-[380px]"
            onClick={() => setSelected(featured)}
          />
        )}

        <div className="md:col-span-4 flex flex-col gap-3">
          {rest.slice(0, 2).map(w => (
            <MediaCard
              key={w.id}
              {...w}
              className="min-h-[180px]"
              onClick={() => setSelected(w)}
            />
          ))}
        </div>

        {rest.slice(2).map(w => (
          <MediaCard
            key={w.id}
            {...w}
            className="md:col-span-6 min-h-[220px]"
            onClick={() => setSelected(w)}
          />
        ))}
      </div>

      <p className="mt-8 font-mono text-[10px] text-[#282828] text-center">
        カードをクリックすると詳細が表示されます
      </p>

      <WorkModal work={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
