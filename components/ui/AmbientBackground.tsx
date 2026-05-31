'use client'

// SVG noise — fractalNoise, desaturated, tiled 200×200
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/**
 * Minimal static background for the Model page.
 * Solid deep-dark base to fully suppress the Three.js canvas,
 * plus a very subtle film grain and a soft edge vignette.
 * Intentionally still — all visual activity comes from user interaction.
 */
export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Solid dark base — fully suppresses the 3D canvas */}
      <div className="absolute inset-0" style={{ background: '#080807' }} />

      {/* Film grain — barely perceptible texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.026,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge vignette — gentle corner darkening */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 52%, rgba(2,2,2,0.55) 100%)',
        }}
      />
    </div>
  )
}
