import type { NextConfig } from 'next'

// GITHUB_ACTIONS は GitHub Actions 上で自動設定される。
// 本体ポートフォリオ（/portfolio-site）配下の /rokeboard/ で配信する。
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const basePath = isGitHubActions ? '/portfolio-site/rokeboard' : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
