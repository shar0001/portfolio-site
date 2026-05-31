'use client'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function AmbientBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep blue base */}
      <div className="absolute inset-0" style={{ background: '#0e1220' }} />

      {/* Top-left blue glow */}
      <div
        className="absolute"
        style={{
          top: '-15%', left: '-10%',
          width: '65%', height: '65%',
          background: 'radial-gradient(ellipse at center, rgba(80,120,220,0.22) 0%, transparent 68%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Right violet glow */}
      <div
        className="absolute"
        style={{
          top: '15%', right: '-12%',
          width: '52%', height: '55%',
          background: 'radial-gradient(ellipse at center, rgba(130,90,210,0.14) 0%, transparent 68%)',
          filter: 'blur(56px)',
        }}
      />

      {/* Bottom-center cyan glow */}
      <div
        className="absolute"
        style={{
          bottom: '-8%', left: '22%',
          width: '55%', height: '42%',
          background: 'radial-gradient(ellipse at center, rgba(60,160,210,0.10) 0%, transparent 68%)',
          filter: 'blur(64px)',
        }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.028,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 110% 110% at 50% 50%, transparent 42%, rgba(6,8,18,0.62) 100%)',
        }}
      />
    </div>
  )
}
