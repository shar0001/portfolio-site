// ============================================================
//  自己紹介を編集するファイル
//  ここを変更すると About ページに反映されます
// ============================================================

export const profile = {
  /** 表示名（ナビの SHR とトップページの名前） */
  name: 'Shusaku Nishiura',

  /** 英語の職種タイトル（ナビ・メタ） */
  title: 'PM / Motion Designer / App Developer',

  /**
   * トップページの日本語キャッチコピー
   * \n で改行できます
   */
  catchJa:
    '営業、モデル、映像、アプリ開発。\n遠回りしてきた分だけ、視点の引き出しが増えました。\nまだ途中ですが、手は動かし続けています。',

  /**
   * 英語の一文
   * ヘッダー下や About に使用
   */
  catchEn:
    'From the runway to the renderer — a non-linear path that turned out to be the point.',

  /** 連絡先メールアドレス */
  email: 'hello@example.com', // ← 自分のメールアドレスに変更してください

  /**
   * スキルタグ（トップページに表示）
   * 順番を変えたり、追加・削除できます
   */
  tags: ['Motion Designer', 'App Developer', 'PM', 'Ex-Model'],

  /**
   * About ページの説明文（2〜3段落）
   * paragraphs の配列に書いてください
   */
  bio: [
    '新卒で住宅営業に就いたあと、ずっとやりたかったモデルの仕事に飛び込みました。パリ・ミラノのコレクションに出られたのは運もあったけど、ビザも英語も自分でどうにかするしかない環境が、「まずやってみる」という癖をつけてくれたと思っています。',

    '帰国後、映像の仕事を始めました。After Effectsはほぼ独学で、最初の5ヶ月は本当にわからないことだらけでした。でも小学館でPR動画を任せてもらえるようになって、「作ったものが実際に動く」おもしろさを知りました。モデル経験で培った「見た目の解像度」が、ここで初めてちゃんと活きた気がしています。',

    '今はPMとして制作進行を担いながら、個人でiOSアプリも作っています。Blenderも少しずつ。まだまだ研鑽中ですが、各分野の「現場がわかる」人間として、もの作りに関わっていきたいと思っています。',
  ],

  /**
   * キャリア年表
   * 新しい順に書いてください
   */
  career: [
    { year: '2026 —',      role: 'Production Manager',  org: '東北新社' },
    { year: '2025',        role: 'Motion Designer',      org: '小学館（フリーランス）' },
    { year: '2024 —',      role: 'App Developer',        org: 'Independent' },
    { year: '2022 — 2025', role: 'Fashion Model',        org: 'Bravo Tokyo / Paris, Milan' },
    { year: '2021',        role: 'Sales',                org: '一条工務店' },
  ],
}
