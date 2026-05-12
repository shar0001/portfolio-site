import { MediaCard } from '@/components/ui/MediaCard'
import { modelArchive as archive } from '@/content/model'

export default function ModelPage() {
  const featured = archive.find(a => a.featured)!
  const grid = archive.filter(a => !a.featured)

  return (
    <main className="min-h-screen px-8 md:px-16 lg:px-24 pt-24 pb-20">
      {/* Header */}
      <div className="mb-16 max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#383838] uppercase mb-4">03</p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#f0f0f0] mb-4">
          Model
        </h1>
        <p className="text-sm text-[#505050] leading-relaxed">
          ビジュアルディレクションの記録。エディトリアル、キャンペーン、ランウェイなどの活動アーカイブ。
        </p>
      </div>

      {/* Bento photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-12 gap-3">
        {/* Featured large */}
        <MediaCard
          {...featured}
          className="col-span-2 md:col-span-5 row-span-2 min-h-[440px]"
        />

        {/* Grid items */}
        {grid.slice(0, 2).map(item => (
          <MediaCard
            key={item.id}
            {...item}
            className="col-span-1 md:col-span-4 min-h-[210px]"
          />
        ))}
        <MediaCard
          {...grid[2]}
          className="col-span-1 md:col-span-3 min-h-[210px]"
        />

        {grid.slice(3).map(item => (
          <MediaCard
            key={item.id}
            {...item}
            className="col-span-1 md:col-span-4 min-h-[220px]"
          />
        ))}
      </div>

      {/* Caption */}
      <p className="mt-8 font-mono text-[10px] text-[#282828] text-center">
        写真・動画を追加するには <code className="text-[#383838]">public/media/</code> にファイルを置き src を指定してください
      </p>
    </main>
  )
}
