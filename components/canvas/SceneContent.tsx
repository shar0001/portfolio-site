'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import gsap from 'gsap'
import { sceneState, ROUTE_CONFIGS } from '@/lib/sceneState'
import { FloatingObject } from './objects/FloatingObject'
import { ParticleField } from './objects/ParticleField'

export function SceneContent() {
  const { camera } = useThree()
  const pointLightRef = useRef<THREE.PointLight>(null)
  const prevRouteRef  = useRef(sceneState.activeRoute)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const isAbout = sceneState.activeRoute === '/'

    // ── Scroll drift ──
    camera.position.y += (-sceneState.scrollProgress * 1.5 - camera.position.y) * 0.02

    // ── About-only: camera slowly orbits the object ──
    if (isAbout) {
      const orbitX = Math.sin(t * 0.045) * 2.2
      const orbitZ = 6 + Math.cos(t * 0.03)  * 1.2
      camera.position.x += (orbitX - camera.position.x) * 0.006
      camera.position.z += (orbitZ - camera.position.z) * 0.006
    }

    // ── About-only: point light breathes ──
    if (pointLightRef.current) {
      if (isAbout) {
        pointLightRef.current.intensity = 1.2 + Math.sin(t * 0.85) * 0.7
      }
    }

    // ── Route change → dramatic GSAP sweep ──
    if (prevRouteRef.current !== sceneState.activeRoute) {
      prevRouteRef.current = sceneState.activeRoute
      const cfg = ROUTE_CONFIGS[sceneState.activeRoute] ?? ROUTE_CONFIGS['/']

      // Only force camera X/Z on non-About routes
      // (About orbit takes over after GSAP settles)
      gsap.killTweensOf(camera.position)
      gsap.to(camera.position, {
        x: cfg.camera.x,
        z: cfg.camera.z,
        duration: 1.8,
        ease: 'power3.inOut',
      })

      if (sceneState.objectGroupRef) {
        gsap.killTweensOf(sceneState.objectGroupRef.position)
        gsap.killTweensOf(sceneState.objectGroupRef.scale)
        gsap.to(sceneState.objectGroupRef.position, {
          x: cfg.object.x, y: cfg.object.y, z: cfg.object.z,
          duration: 1.8, ease: 'power3.inOut',
        })
        gsap.to(sceneState.objectGroupRef.scale, {
          x: cfg.scale, y: cfg.scale, z: cfg.scale,
          duration: 1.8, ease: 'back.out(1.1)',
        })
      }

      if (pointLightRef.current) {
        gsap.to(pointLightRef.current.color, {
          r: cfg.lightColor.r, g: cfg.lightColor.g, b: cfg.lightColor.b,
          duration: 1.5, ease: 'power2.inOut',
        })
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} />
      <pointLight
        ref={pointLightRef}
        position={[-4, 3, -4]}
        intensity={1.2}
        color="#818cf8"
      />
      <pointLight position={[6, -2, 2]} intensity={0.3} color="#c7d2fe" />

      <FloatingObject />
      <ParticleField />

      {typeof window !== 'undefined' && window.innerWidth >= 768 && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.25} luminanceSmoothing={0.9} intensity={0.8} />
        </EffectComposer>
      )}
    </>
  )
}
