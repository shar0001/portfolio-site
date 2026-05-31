'use client'

// Grain SVG — fractalNoise at 0.75 freq, desaturated, tiled
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

/**
 * Fixed atmospheric background for the Model page.
 * Layered: dark warm base → radial gradient orbs → grain → vignette
 * Suppresses the game-like 3D scene with a semi-transparent warm overlay.
 *
 * z-index: 0 — sits above the Three.js canvas (z-index 0 global)
 * but below model page <main> (z-index 1, relative).
 */
export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* ── 1. Dark warm base — partially suppresses 3D scene ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 85% 55% at 18% 8%, rgba(203,183,131,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 60% 70% at 88% 38%, rgba(155,168,174,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse 55% 45% at 50% 95%, rgba(232,224,206,0.05) 0%, transparent 55%)',
            '#0A0A08',
          ].join(', '),
        }}
      />

      {/* ── 2. Slow-drifting warm orb — upper-left ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'min(70vw, 860px)',
          height: 'min(70vw, 860px)',
          top: '-18%',
          left: '-14%',
          background: 'radial-gradient(circle, rgba(203,183,131,0.10) 0%, transparent 68%)',
          filter: 'blur(90px)',
          animation: 'ambient-drift-1 30s ease-in-out infinite',
        }}
      />

      {/* ── 3. Slow-drifting cool orb — right ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'min(55vw, 720px)',
          height: 'min(55vw, 720px)',
          top: '25%',
          right: '-16%',
          background: 'radial-gradient(circle, rgba(155,168,174,0.09) 0%, transparent 68%)',
          filter: 'blur(110px)',
          animation: 'ambient-drift-2 38s ease-in-out infinite',
        }}
      />

      {/* ── 4. Faint ivory mist — lower centre ── */}
      <div
        className="absolute rounded-full"
        style={{
          width: 'min(45vw, 560px)',
          height: 'min(45vw, 560px)',
          bottom: '-12%',
          left: '30%',
          background: 'radial-gradient(circle, rgba(232,224,206,0.06) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'ambient-drift-3 44s ease-in-out infinite',
        }}
      />

      {/* ── 5. Film grain overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.038,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── 6. Edge vignette — darkens corners ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(5,5,4,0.75) 100%)',
        }}
      />
    </div>
  )
}
