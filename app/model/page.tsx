'use client'
import { useState } from 'react'
import { MediaCard } from '@/components/ui/MediaCard'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { VideoModal } from '@/components/ui/VideoModal'
import { modelArchive as archive } from '@/content/model'

type Item = (typeof archive)[number]

export default function ModelPage() {
  const [workModal,  setWorkModal]  = useState<WorkDetail | null>(null)
  const [videoModal, setVideoModal] = useState<Item | null>(null)

  const featured = archive.find(a => a.featured)!
  const grid      = archive.filter(a => !a.featured)

  const handleClick = (item: Item) => {
    if (item.type === 'video' && item.src) {
      setVideoModal(item)
    } else {
      setWorkModal(item)
    }
  }

  return (
    <main className="min-h-screen px-8 md:px-16 lg:px-24 pt-24 pb-20">
      <div className="mb-16 max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">03</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f0f0f0] mb-4">
          Model
        </h1>
        <p className="text-sm text-[#505050] leading-relaxed">
          ビジュアルディレクションの記録。エディトリアル、キャンペーン、ランウェイなどの活動アーカイブ。
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-12 gap-3">
        <MediaCard
          {...featured}
          className="col-span-2 md:col-span-5 row-span-2 min-h-[440px]"
          onClick={() => handleClick(featured)}
        />

        {grid.slice(0, 2).map(item => (
          <MediaCard
            key={item.id}
            {...item}
            className="col-span-1 md:col-span-4 min-h-[210px]"
            onClick={() => handleClick(item)}
          />
        ))}
        <MediaCard
          {...grid[2]}
          className="col-span-1 md:col-span-3 min-h-[210px]"
          onClick={() => handleClick(grid[2])}
        />

        {grid.slice(3).map(item => (
          <MediaCard
            key={item.id}
            {...item}
            className="col-span-1 md:col-span-4 min-h-[220px]"
            onClick={() => handleClick(item)}
          />
        ))}
      </div>

      <WorkModal  work={workModal}  onClose={() => setWorkModal(null)} />
      <VideoModal
        src={videoModal?.src}
        title={videoModal?.title}
        tag={videoModal?.tag}
        year={videoModal?.year}
        onClose={() => setVideoModal(null)}
      />
    </main>
  )
}
