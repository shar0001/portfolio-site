import type { Metadata } from 'next'
import './studio.css'
import { StudioNav } from '@/components/studio/StudioNav'
import { StudioCursor } from '@/components/studio/StudioCursor'
import { StudioAtmosphere } from '@/components/studio/StudioAtmosphere'

export const metadata: Metadata = {
  title: 'SHR — Studio',
  description: 'Body, image, product, motion — a digital studio portfolio.',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-theme">
      {/* Channel-isolation filters for the prism (chromatic aberration) preview */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="s-red" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="s-green" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="s-blue" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>

      <StudioAtmosphere />
      <StudioNav />
      <StudioCursor />
      {children}
    </div>
  )
}
