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
      {/* Very dim ambient — reference is near-black with only edge highlights */}
      <ambientLight intensity={0.12} color="#8090c0" />

      {/* Sharp directional keys for crisp specular on the ribbon edges */}
      <directionalLight position={[ 3,  5,  3]} intensity={1.4} color="#d0e4ff" />
      <directionalLight position={[-4,  1, -4]} intensity={0.9} color="#6070ff" />
      <pointLight       position={[ 2, -4,  3]} intensity={2.5} color="#ffd0a0" distance={14} />

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
            form="rect" intensity={7.5} color="#ffffff"
            position={[2, 5, -5]} scale={[12, 0.7, 1]} target={[0, 0, 0]}
          />
          {/* Counter-rim from below — crisp underside edge catch */}
          <Lightformer
            form="rect" intensity={3.5} color="#c8e0ff"
            position={[-2, -5, -4]} scale={[10, 0.6, 1]} target={[0, 0, 0]}
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
