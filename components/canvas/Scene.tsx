'use client'
import { Canvas } from '@react-three/fiber'
import { SceneContent } from './SceneContent'

export default function Scene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      camera={{ position: [0, 0, 6], fov: 70 }}
      gl={{
        antialias: !mobile,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, mobile ? 1 : 1.5]}
      performance={{ min: 0.5 }}
    >
      <SceneContent />
    </Canvas>
  )
}
