import type { NextConfig } from 'next'

// GITHUB_ACTIONS env var is set automatically by GitHub Actions
const basePath = process.env.GITHUB_ACTIONS ? '/portfolio-site' : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  env: {
    // Exposes basePath to client components for raw <video>/<source> src attributes
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig
