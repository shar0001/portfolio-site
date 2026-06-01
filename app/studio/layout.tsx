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
      <StudioAtmosphere />
      <StudioNav />
      <StudioCursor />
      {children}
    </div>
  )
}
