// ============================================================
//  Apps ページのコンテンツ
//  スクリーンショットは public/media/ に置いて src を設定してください
// ============================================================

export const appWorks = [
  {
    id: '01',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/neon-mochi-ss.png'
    title: 'Neon Mochi',
    description:
      '書くことに集中できるミニマルなテキストエディタ。余計な機能を削り、タイピングのリズムを大切にしました。個人的に「こういうアプリがほしい」から作り始めた一本。',
    year: '2024',
    tag: 'iOS App',
    featured: true,
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    storeUrl: undefined,      // 例: 'https://apps.apple.com/app/neon-mochi/id...'
  },
  {
    id: '02',
    type: 'photo' as const,
    src: undefined,           // 例: '/media/pittanko-ss.png'
    title: 'ピッタンコ',
    description:
      '割り勘をサクッと計算するアプリ。グループ管理・カスタム比率・精算まで一気通貫。「毎回計算が面倒」という友人の一言がきっかけ。',
    year: '2024',
    tag: 'iOS App',
    featured: false,
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    storeUrl: undefined,
  },
]

export const pmSkills = [
  {
    label: '制作進行・スケジュール管理',
    desc: '映像・アプリ両方の現場を知っているので、無理なスケジュールを事前に察知できます',
  },
  {
    label: '要件整理・仕様書作成',
    desc: 'Figma を使ったワイヤーフレームから、エンジニアへの仕様伝達まで',
  },
  {
    label: '0 → 1 の提案',
    desc: '小学館での映像事業立ち上げのように、ゼロから動かす経験があります',
  },
]
