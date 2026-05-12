export const appWorks = [
  {
    id: '01',
    type: 'photo' as const,
    src: undefined,
    title: 'Neon Mochi',
    description:
      '「書くこと」に没入するためのミニマルなテキストエディタ。余計な機能を削り、タイピングのリズムだけを残しました。個人的に「こういうアプリがほしい」から作り始めた一本。',
    year: '2024',
    tag: 'iOS App',
    featured: true,
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    storeUrl: undefined,
    insight:
      'ユーザーが思考を妨げられないよう、UIのノイズを徹底的に削ぎ落とした。「書くこと」だけに集中できる空間を設計することがゴール。',
  },
  {
    id: '02',
    type: 'photo' as const,
    src: undefined,
    title: 'ピッタンコ',
    description:
      '割り勘をサクッと計算するアプリ。グループ管理・カスタム比率・精算まで一気通貫。「毎回計算が面倒」という友人の一言がきっかけ。',
    year: '2024',
    tag: 'iOS App',
    featured: false,
    tech: ['Swift', 'SwiftUI', 'Firebase'],
    status: 'Released',
    storeUrl: undefined,
    insight:
      '複雑な比率計算もワンタップで完結するUXを追求。PMとして仕様を自分で決め、エンジニアとして実装まで担った経験が凝縮されている。',
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
