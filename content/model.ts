/**
 * Model Archive — image catalogue with display metadata.
 *
 * Each image declares how it should be presented so the page can frame it
 * naturally — no forced full-bleed crops, no oversized faces.
 *
 * Filenames point to /public/media/ (exact names, incl. spaces / × / 日本語).
 * The page URL-encodes them at render time, so readable names are fine here.
 *
 *   orientation  — drives the frame aspect ratio
 *   fit          — 'cover' fills the frame (slight crop) · 'contain' shows the
 *                  whole photo with breathing room (used for close-ups)
 *   position     — CSS object-position, controls which part stays visible
 *   layout       — 'hero' | 'featured' | 'grid' | 'single'
 */

export type Orientation = 'portrait' | 'landscape' | 'square' | 'closeup' | 'fullbody'
export type Fit = 'cover' | 'contain'
export type Layout = 'hero' | 'featured' | 'grid' | 'single'

export interface ModelImage {
  id: string
  src: string
  alt: string
  orientation: Orientation
  fit?: Fit
  position?: string
  layout?: Layout
}

// ── Hero ─────────────────────────────────────────────────────────────────────
// Close-up jewelry portrait (1436×1944). Presented as a CONTAINED editorial
// frame — never full-bleed — so the face is not oversized.
export const heroImage: ModelImage = {
  id: 'hero',
  src: '/media/ELLE JAPON × Van Cleef & Arpels.jpg',
  alt: 'Shusaku Nishiura — Van Cleef & Arpels',
  orientation: 'closeup',
  fit: 'contain',
  position: 'center center',
  layout: 'hero',
}

// ── Gallery ──────────────────────────────────────────────────────────────────
// Each image keeps its true aspect ratio in a masonry column — portraits stay
// portrait, landscape stays wide, square stays square. No captions.
export const galleryImages: ModelImage[] = [
  {
    id: 'vca-editorial',
    src: '/media/ELLE JAPON×Van Cleef & Arpels.jpg', // 1439×1949 portrait
    alt: 'Van Cleef & Arpels — editorial',
    orientation: 'portrait',
    fit: 'cover',
    position: 'center 20%',
    layout: 'grid',
  },
  {
    id: 'mikimoto',
    src: '/media/MIKIMOTO.jpg', // 1440×1018 landscape
    alt: 'MIKIMOTO — Lucky Arrows',
    orientation: 'landscape',
    fit: 'cover',
    position: 'center center',
    layout: 'grid',
  },
  {
    id: 'korea',
    src: '/media/韓国.jpeg', // 3072×4608 tall portrait / full body
    alt: 'Editorial — full look',
    orientation: 'fullbody',
    fit: 'cover',
    position: 'center 25%',
    layout: 'grid',
  },
  {
    id: 'material',
    src: '/media/素材01.jpg', // 3000×3000 square
    alt: 'Editorial',
    orientation: 'square',
    fit: 'cover',
    position: 'center center',
    layout: 'grid',
  },
]

// ── Motion / Runway film (optional, unused in current layout) ─────────────────
export const runwayFilm = {
  src:   '/media/MIKIMOTO.mp4' as string | undefined,
  thumb: '/media/MIKIMOTO.jpg' as string | undefined,
}

/** Aspect ratio (w / h as CSS string) per orientation — used for grid frames. */
export const aspectFor: Record<Orientation, string> = {
  portrait:  '3 / 4',
  fullbody:  '2 / 3',
  landscape: '3 / 2',
  square:    '1 / 1',
  closeup:   '3 / 4',
}
