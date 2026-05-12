// ============================================================
//  Movie ページのコンテンツ
//  動画ファイルは public/media/ に置いて src を設定してください
// ============================================================

export const movieWorks = [
  {
    id: '01',
    type: 'video' as const,
    src: undefined,           // 例: '/media/shogakukan-pr.mp4'
    thumbnail: undefined,     // 例: '/media/shogakukan-pr-thumb.jpg'
    title: 'マンガ PR 動画 — 小学館',
    description:
      '映像制作体制がゼロの状態から、編集部に自主提案して受注した動画シリーズ。AEでのシェイプアニメーションとExpression制御を活用。',
    year: '2025',
    tag: 'Motion Graphics',
    featured: true,
    // featured: true にすると一番大きく表示されます（1つだけ）
  },
  {
    id: '02',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'タイポグラフィ実験作',
    description:
      '音と映像の同期にこだわったパーソナルな実験作。Expressionで文字に物理挙動をつけています。',
    year: '2025',
    tag: 'Typography',
    featured: false,
  },
  {
    id: '03',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'プロダクト UI アニメーション',
    description:
      'iOSアプリのデモ用に制作。実機の動作に合わせたモーションデザイン。',
    year: '2024',
    tag: 'UI Motion',
    featured: false,
  },
  {
    id: '04',
    type: 'video' as const,
    src: undefined,
    thumbnail: undefined,
    title: 'Blender 習作',
    description:
      '3DCGを独学中。まだ途中ですが、その過程も含めて記録しています。',
    year: '2026',
    tag: '3D / WIP',
    featured: false,
  },
]
