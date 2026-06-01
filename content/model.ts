/**
 * Model Archive — asset paths
 *
 * These point to the files uploaded to /public/media/ (exact names, including
 * spaces / special characters). The page URL-encodes them at render time, so
 * the readable names below are fine to keep as-is.
 *
 * To swap which photo appears where, just move a filename to a different slot.
 */
export const modelImages = {
  // ── Hero (full-screen top image) ─────────────────────────────────────────
  hero:         '/media/ELLE JAPON × Van Cleef & Arpels.jpg',

  // ── Selected work grid ───────────────────────────────────────────────────
  editorial01:  '/media/ELLE JAPONxVan Cleef & Arpels.jpg',   // large left
  milan01:      '/media/20240311_Shusaku.414_1.jpeg',          // right top
  commercial01: '/media/IMAGE_4.jpg',                          // right bottom
  lookbook01:   '/media/資料.jpg',                              // wide bottom

  // ── Profile portrait ─────────────────────────────────────────────────────
  portrait01:   '/media/20240311_Shusaku.414_1.jpeg',
  portrait02:   undefined as string | undefined,
  portrait03:   undefined as string | undefined,

  // ── Motion / Runway Film ─────────────────────────────────────────────────
  runwayFilm:      undefined as string | undefined,
  runwayFilmThumb: undefined as string | undefined,
}
