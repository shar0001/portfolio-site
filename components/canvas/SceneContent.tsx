'use client'
import { Suspense } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment } from '@react-three/drei'
import { GlassSculpture } from './objects/GlassSculpture'

export function SceneContent() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.55} color="#b0c8ff" />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#c8deff" />

      {/* Colored point lights for dramatic iridescent reflections */}
      <pointLight position={[ 4,  4,  2]} color="#6080ff" intensity={6}  distance={14} />
      <pointLight position={[-3, -2,  3]} color="#50d8ff" intensity={5}  distance={12} />
      <pointLight position={[ 0,  5, -4]} color="#b080ff" intensity={3.5} distance={12} />
      <pointLight position={[-2,  3,  2]} color="#ffffff" intensity={2.5} distance={10} />
      <pointLight position={[ 3, -3,  1]} color="#80c0ff" intensity={2}  distance={10} />

      {/* Environment map drives the iridescence shimmer */}
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} />
        <GlassSculpture />
      </Suspense>

      {/* Bloom — very subtle, just softens bright highlights */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.28}
            luminanceSmoothing={0.88}
            intensity={0.55}
          />
        </EffectComposer>
      )}
    </>
  )
}
