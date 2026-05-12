// ============================================================
//  Model ページのコンテンツ
//  写真は public/media/ に置いて src を設定してください
//  featured: true にすると左の大きいコマに表示（1つだけ）
// ============================================================

export const modelArchive = [
  {
    id: 'P01',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/paris-editorial.jpg'
    title: 'Paris Collection',
    year: '2023',
    tag: 'Editorial',
    featured: true,
  },
  {
    id: 'P02',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/milan-show.jpg'
    title: 'Milan Fashion Week',
    year: '2023',
    tag: 'Runway',
    featured: false,
  },
  {
    id: 'P03',
    type: 'photo' as const,
    src: undefined,
    title: 'Commercial Campaign',
    year: '2024',
    tag: 'Campaign',
    featured: false,
  },
  {
    id: 'P04',
    type: 'photo' as const,
    src: undefined,
    title: 'Portrait',
    year: '2022',
    tag: 'Portrait',
    featured: false,
  },
  {
    id: 'P05',
    type: 'photo' as const,
    src: undefined,
    title: 'Lookbook',
    year: '2024',
    tag: 'Lookbook',
    featured: false,
  },
  {
    id: 'V01',
    type: 'video' as const,
    src: undefined,           // 例: '/media/runway-video.mp4'
    thumbnail: undefined,     // 例: '/media/runway-thumb.jpg'
    title: 'Runway Film',
    year: '2023',
    tag: 'Film',
    featured: false,
  },
]
