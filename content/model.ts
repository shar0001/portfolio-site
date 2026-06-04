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
  type?: 'image' | 'video'
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
    src: '/media/ELLE JAPON×Van Cleef & Arpels.jpg',
    alt: 'Van Cleef & Arpels — editorial',
    orientation: 'portrait',
    fit: 'cover',
    position: 'center 20%',
    layout: 'grid',
  },
  {
    id: 'nishiura-video-01',
    src: '/media/nishiura_video_01.mp4',
    alt: 'Runway Video',
    orientation: 'fullbody',
    type: 'video',
    layout: 'grid',
  },
  {
    id: 'nishiura-01',
    src: '/media/nishiura_01.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-02',
    src: '/media/nishiura_02.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'mikimoto',
    src: '/media/MIKIMOTO.jpg',
    alt: 'MIKIMOTO — Lucky Arrows',
    orientation: 'landscape',
    fit: 'cover',
    position: 'center center',
    layout: 'grid',
  },
  {
    id: 'nishiura-03',
    src: '/media/nishiura_03.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-04',
    src: '/media/nishiura_04.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'landscape',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-05',
    src: '/media/nishiura_05.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-06',
    src: '/media/nishiura_06.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-07',
    src: '/media/nishiura_07.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-08',
    src: '/media/nishiura_08.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-09',
    src: '/media/nishiura_09.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-10',
    src: '/media/nishiura_10.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-11',
    src: '/media/nishiura_11.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-12',
    src: '/media/nishiura_12.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'landscape',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-13',
    src: '/media/nishiura_13.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-14',
    src: '/media/nishiura_14.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-15',
    src: '/media/nishiura_15.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'fullbody',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-16',
    src: '/media/nishiura_16.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-17',
    src: '/media/nishiura_17.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-18',
    src: '/media/nishiura_18.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'nishiura-20',
    src: '/media/nishiura_20.jpg',
    alt: 'Shusaku Nishiura',
    orientation: 'portrait',
    fit: 'cover',
    layout: 'grid',
  },
  {
    id: 'korea',
    src: '/media/韓国.jpeg',
    alt: 'Editorial — full look',
    orientation: 'fullbody',
    fit: 'cover',
    position: 'center 25%',
    layout: 'grid',
  },
  {
    id: 'material',
    src: '/media/素材01.jpg',
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
