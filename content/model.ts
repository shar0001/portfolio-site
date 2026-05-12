// ============================================================
//  Model ページのコンテンツを編集するファイル
//
//  【写真の追加方法】
//  1. public/media/ に jpg/png を置く
//     例: public/media/photo-editorial-01.jpg
//  2. src に '/media/photo-editorial-01.jpg' と書く
//
//  【動画の追加方法】
//  1. public/media/ に mp4 を置く
//  2. type を 'video' にして src・thumbnail を設定する
//
//  featured: true にすると左大カラムに表示（1つだけ）
// ============================================================

export const modelArchive = [
  {
    id: 'P01',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/photo-editorial-01.jpg'
    title: 'Editorial',
    year: '2022',
    tag: 'Editorial',
    featured: true,
  },
  {
    id: 'P02',
    type: 'photo' as const,
    src: undefined,
    title: 'Campaign',
    year: '2021',
    tag: 'Campaign',
    featured: false,
  },
  {
    id: 'P03',
    type: 'photo' as const,
    src: undefined,
    title: 'Portrait',
    year: '2022',
    tag: 'Portrait',
    featured: false,
  },
  {
    id: 'P04',
    type: 'photo' as const,
    src: undefined,
    title: 'Commercial',
    year: '2020',
    tag: 'Commercial',
    featured: false,
  },
  {
    id: 'P05',
    type: 'photo' as const,
    src: undefined,
    title: 'Lookbook',
    year: '2023',
    tag: 'Lookbook',
    featured: false,
  },
  {
    id: 'V01',
    type: 'video' as const,
    src: undefined,           // 例: '/media/runway.mp4'
    thumbnail: undefined,     // 例: '/media/runway-thumb.jpg'
    title: 'Runway',
    year: '2021',
    tag: 'Video',
    featured: false,
  },
]
