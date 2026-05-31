/**
 * Model Archive — asset paths
 *
 * Upload files to /public/media/ in the repository, then the paths below
 * will be picked up automatically on the next deploy.
 *
 * File names expected (upload these 4 images via GitHub web UI or git):
 *   /public/media/vcarpels-01.jpg   → Van Cleef & Arpels p.193 (ring + necklace)
 *   /public/media/vcarpels-02.jpg   → Van Cleef & Arpels p.192 (eyes closed)
 *   /public/media/mikimoto-01.jpg   → MIKIMOTO Lucky Arrows (B&W)
 *   /public/media/editorial-01.jpg  → Black blazer × red bag (outdoor)
 */
export const modelImages = {
  // ── Hero (tall vertical, left column of split hero) ──────────────────────
  hero:         '/media/vcarpels-01.jpg',

  // ── Selected Visuals ─────────────────────────────────────────────────────
  editorial01:  '/media/vcarpels-01.jpg',   // large left — VCA p.193
  milan01:      '/media/vcarpels-02.jpg',   // small right top — VCA p.192
  commercial01: '/media/mikimoto-01.jpg',   // small right bottom — MIKIMOTO

  // ── Commercial / Campaign ────────────────────────────────────────────────
  lookbook01:   '/media/editorial-01.jpg',  // black blazer × red bag

  // ── Portrait Archive (3 vertical frames) ─────────────────────────────────
  portrait01:   '/media/vcarpels-02.jpg',   // VCA eyes closed
  portrait02:   '/media/mikimoto-01.jpg',   // MIKIMOTO B&W
  portrait03:   '/media/editorial-01.jpg',  // outdoor editorial

  // ── Motion / Runway Film ─────────────────────────────────────────────────
  runwayFilm:      undefined as string | undefined,
  runwayFilmThumb: undefined as string | undefined,
}
