// ============================================================
//  Apps ページのコンテンツを編集するファイル
//
//  【スクリーンショットの追加方法】
//  1. public/media/ に画像を置く
//     例: public/media/pittanko-ss.png
//  2. src に '/media/pittanko-ss.png' と書く
// ============================================================

export const appWorks = [
  {
    id: '01',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/pittanko-ss.png'
    title: 'ピッタンコ',
    description:
      '割り勘計算アプリ。グループ管理・カスタム比率・即時精算に対応。Swift / SwiftUI / Firebase で開発。',
    year: '2024',
    tag: 'iOS App',
    featured: true,
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    storeUrl: undefined,      // 例: 'https://apps.apple.com/...'
  },
  {
    id: '02',
    type: 'photo' as const,
    src: undefined,
    title: 'App 02',
    description: '開発中。詳細は近日公開予定。',
    year: '2025',
    tag: 'iOS / Android',
    featured: false,
    tech: ['React Native', 'Supabase', 'TypeScript'],
    status: 'In Dev',
    storeUrl: undefined,
  },
]

export const pmSkills = [
  { label: 'Roadmap planning',      desc: 'Quarter / sprint ロードマップ策定' },
  { label: 'Sprint management',     desc: 'Agile / スクラム運営' },
  { label: 'Stakeholder alignment', desc: '関係者調整・仕様整理' },
]
