# ポートフォリオサイト 引き継ぎ資料
> この文書を Gemini にそのまま貼り付けて「コンテンツを埋める手伝いをして」と頼んでください。

---

## あなたに依頼したいこと

私のポートフォリオサイトのコンテンツ（文章・写真パス・動画パス）を
以下のファイルに埋めるための相談に乗ってください。
私が情報を伝えるので、どのファイルのどこに何を書けばよいか教えてください。

---

## サイトの概要

**制作者プロフィール**
- PM（プロダクトマネージャー）
- アプリ開発者（Swift / React Native）
- 映像クリエイター（After Effects）
- 元モデル

という4つの顔を持つクリエイターの個人ポートフォリオサイトです。

**技術スタック**（相談する必要はありません、参考情報）
- Next.js 15（App Router）
- React Three Fiber（3D背景）
- Tailwind CSS
- Vercel でホスティング予定

---

## サイトのページ構成

| URL | 内容 |
|-----|------|
| `/` | トップ（自己紹介 + 3つのカテゴリへのリンク） |
| `/movie` | 映像作品ギャラリー（動画カード） |
| `/apps` | アプリ開発ポートフォリオ |
| `/model` | モデル活動のビジュアルアーカイブ（写真・動画） |

---

## 編集するファイルは4つだけ

### ① `content/profile.ts` ← 自己紹介テキスト

```typescript
export const profile = {
  name: 'Shusaku',           // ← 表示名

  title: 'PM / App Developer / Motion Designer',  // ← 職種

  catchJa: 'PM・アプリ開発者・映像クリエイター・元モデル。\nテクノロジーとビジュアルの交差点でものを作っています。',
  // ↑ トップページの日本語キャッチコピー（\n で改行）

  catchEn: 'Started in front of the camera, now building what runs behind screens.',
  // ↑ 英語の一文

  email: 'hello@example.com',  // ← 連絡先メール

  tags: ['PM', 'App Developer', 'Motion Designer', 'Model'],
  // ↑ トップページに表示されるタグ（順番・内容を自由に変えられる）

  career: [
    { year: '2026 —', role: 'Product Manager', org: 'Current' },
    { year: '2023',   role: 'App Developer',    org: 'Freelance' },
    { year: '2021',   role: 'Motion Designer',  org: 'Agency' },
    { year: '2018',   role: 'Model',            org: 'Agency' },
  ],
  // ↑ キャリア年表。year / role / org の3項目を自由に追加・変更できる
}
```

---

### ② `content/movie.ts` ← 映像作品リスト

各作品は以下の形式で書きます。配列に追記すれば作品を増やせます。

```typescript
{
  id: '01',               // 連番（重複しなければ何でもOK）
  type: 'video',          // 動画は 'video' 固定
  src: '/media/作品名.mp4',        // ← 動画ファイルのパス（後述）
  thumbnail: '/media/サムネ.jpg',  // ← サムネイル画像（任意）
  title: '作品タイトル',
  description: '作品の説明文。短くてOK。',
  year: '2024',           // 制作年
  tag: 'Motion Graphics', // ジャンル（自由記述）
  featured: true,         // true にすると大きく表示（1つだけ true にする）
}
```

**ファイルの置き場所**
```
プロジェクトフォルダ/
└── public/
    └── media/
        ├── brand-motion.mp4      ← 動画ファイル
        ├── brand-motion-thumb.jpg ← サムネイル
        └── ...
```
src には `/media/ファイル名` と書く（`public/` は不要）

---

### ③ `content/apps.ts` ← アプリ作品リスト

```typescript
{
  id: '01',
  type: 'photo',               // スクショは 'photo'
  src: '/media/app-ss.png',    // ← スクリーンショット画像
  title: 'アプリ名',
  description: 'アプリの説明。何ができるか、なぜ作ったかを簡潔に。',
  year: '2024',
  tag: 'iOS App',
  featured: true,
  tech: ['Swift', 'SwiftUI', 'Firebase'],  // 使用技術（配列）
  status: 'Released',          // 'Released' / 'In Dev' / 'Beta' など
  storeUrl: 'https://apps.apple.com/...',  // App Store URL（任意）
}
```

---

### ④ `content/model.ts` ← モデル写真・動画リスト

```typescript
{
  id: 'P01',
  type: 'photo',               // 写真は 'photo'、動画は 'video'
  src: '/media/editorial-01.jpg',
  title: 'Editorial',
  year: '2022',
  tag: 'Editorial',            // Editorial / Campaign / Portrait / Commercial など
  featured: true,              // true にすると左の大きいコマに表示
}
```

---

## 写真・動画の追加手順（まとめ）

```
1. ファイルをコピー
   → プロジェクトフォルダ/public/media/ の中にドラッグ＆ドロップ

2. パスを書く
   → content/movie.ts などを開いて
     src: '/media/ファイル名.mp4'
   と書くだけ

3. 保存して GitHub にプッシュ
   → git add . && git commit -m "add content" && git push
   → Vercel が自動でビルドして公開（1〜2分）
```

---

## Gemini への相談例

以下のように話しかけてください：

> 「映像作品が3つあります。タイトルは〇〇・〇〇・〇〇で、それぞれ〇〇年制作です。
> content/movie.ts にどう書けばいいですか？」

> 「自己紹介文を日本語と英語で考えてほしい。
> 私は〇〇で、〇〇をやっています。ターゲットは〇〇です。」

> 「App Store に公開済みのアプリがあります。
> 説明文を content/apps.ts 用に作ってください。アプリの概要は〇〇です。」

---

## ナビゲーションの色について（参考）

カテゴリをクリックすると3Dの背景が劇的に変化します。
色は固定されています：
- About（トップ）: 紫 `#818cf8`
- Movie: 青 `#3b82f6`
- Apps: バイオレット `#7c3aed`
- Model: ローズ `#f43f5e`

---

*この資料は `/GEMINI_HANDOFF.md` に保存されています。*
