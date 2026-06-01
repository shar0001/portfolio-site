'use client'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
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
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      dpr={[1, mobile ? 1.5 : 2]}
      performance={{ min: 0.5 }}
    >
      <SceneContent />
    </Canvas>
  )
}
