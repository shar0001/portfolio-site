export function ScanLines() {
  return (
    <>
      {/* Static horizontal scanlines — always on */}
      <div
        className="fixed inset-0 pointer-events-none z-[3]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        }}
      />
      {/* Slow-moving scan glow — very subtle */}
      <div
        className="fixed inset-x-0 h-32 pointer-events-none z-[3]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(255,255,255,0.012), transparent)',
          animation: 'nier-scanline 8s linear infinite',
        }}
      />
    </>
  )
}
