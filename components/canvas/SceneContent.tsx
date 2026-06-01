'use client'
import { Suspense, useMemo } from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, Lightformer } from '@react-three/drei'
import { GlassSculpture } from './objects/GlassSculpture'

export function SceneContent() {
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    [],
  )

  return (
    <>
      {/* Soft ambient fill — keeps dark areas from going pure flat black */}
      <ambientLight intensity={0.35} color="#9fb6ff" />

      {/* Cool blue key + warm spectral accent + rim */}
      <directionalLight position={[ 4,  6,  4]} intensity={1.1} color="#cfe0ff" />
      <directionalLight position={[-5,  2, -3]} intensity={0.7} color="#7a86ff" />
      <pointLight       position={[ 3, -3,  2]} intensity={2.0} color="#ffd9a8" distance={12} />

      {/* Environment drives reflections + the iridescent shimmer.
          Built from soft area lights (Lightformers) on a dark stage. */}
      <Suspense fallback={null}>
        <Environment resolution={isMobile ? 256 : 512} background={false}>
          {/* Big soft key panel */}
          <Lightformer
            form="rect" intensity={3.0} color="#dce8ff"
            position={[5, 4, 3]} scale={[10, 12, 1]} target={[0, 0, 0]}
          />
          {/* Cool fill from the left */}
          <Lightformer
            form="rect" intensity={1.6} color="#6f86ff"
            position={[-6, 1, -2]} scale={[8, 10, 1]} target={[0, 0, 0]}
          />
          {/* Bright rim streak — high contrast highlight edge */}
          <Lightformer
            form="rect" intensity={5.0} color="#ffffff"
            position={[2, 5, -5]} scale={[12, 0.7, 1]} target={[0, 0, 0]}
          />
          {/* Warm spectral accent */}
          <Lightformer
            form="circle" intensity={2.2} color="#ffc99a"
            position={[-3, -3, 4]} scale={[4, 4, 1]} target={[0, 0, 0]}
          />
          {/* Cyan/violet kicks for rainbow edges */}
          <Lightformer
            form="circle" intensity={1.8} color="#9affff"
            position={[4, -2, 3]} scale={[3, 3, 1]} target={[0, 0, 0]}
          />
          <Lightformer
            form="circle" intensity={1.6} color="#c9a8ff"
            position={[-4, 4, 2]} scale={[3, 3, 1]} target={[0, 0, 0]}
          />
        </Environment>

        <GlassSculpture mobile={isMobile} />
      </Suspense>

      {/* Bloom — only the brightest highlights bloom, body stays dark/clear */}
      {!isMobile && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.62}
            luminanceSmoothing={0.85}
            intensity={0.5}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  )
}
