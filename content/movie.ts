// ============================================================
//  Movie ページのコンテンツを編集するファイル
//
//  【動画の追加方法】
//  1. public/media/ に mp4 ファイルを置く
//     例: public/media/work-brand.mp4
//  2. src に '/media/work-brand.mp4' と書く
//  3. thumbnail に '/media/work-brand-thumb.jpg' と書く（任意）
//
//  featured: true にすると大きく表示される（1つだけ）
// ============================================================

export const movieWorks = [
  {
    id: '01',
    type: 'video' as const,
    src: undefined,           // 例: '/media/work-brand.mp4'
    thumbnail: undefined,     // 例: '/media/work-brand-thumb.jpg'
    title: 'Brand Identity Motion',
    description: 'After Effects を使用したブランドアイデンティティのモーショングラフィックス。',
    year: '2024',
    tag: 'Motion Graphics',
    featured: true,
  },
  {
    id: '02',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'Product Demo Reel',
    description: 'アプリのデモ映像。UI アニメーションを中心に構成。',
    year: '2024',
    tag: 'AE Composite',
    featured: false,
  },
  {
    id: '03',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'Title Sequence',
    description: 'タイポグラフィを活かしたオープニングシーケンス。',
    year: '2023',
    tag: 'Typography',
    featured: false,
  },
  {
    id: '04',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'Visual Effects Reel',
    description: 'VFX コンポジット作品まとめ。',
    year: '2023',
    tag: 'VFX',
    featured: false,
  },
]
