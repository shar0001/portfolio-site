'use client'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { sceneState } from '@/lib/sceneState'

export function FloatingObject() {
  const groupRef  = useRef<THREE.Group>(null)
  const coreRef   = useRef<THREE.Mesh>(null)
  const ring1Ref  = useRef<THREE.Mesh>(null)
  const ring2Ref  = useRef<THREE.Mesh>(null)
  const ring3Ref  = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (groupRef.current) sceneState.objectGroupRef = groupRef.current
    return () => { sceneState.objectGroupRef = null }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    const isAbout = sceneState.activeRoute === '/'

    // Faster spin on About
    groupRef.current.rotation.x = t * (isAbout ? 0.11 : 0.08)
    groupRef.current.rotation.y = t * (isAbout ? 0.17 : 0.12)

    // Core pulse — breathes on About
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isAbout
        ? 3.5 + Math.sin(t * 1.4) * 2.5
        : 4
    }

    // Orbit rings — fade in on About, out on other routes
    const target = isAbout ? 0.38 : 0
    const refs = [ring1Ref, ring2Ref, ring3Ref]
    refs.forEach((ref, i) => {
      if (!ref.current) return
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.opacity += (target - mat.opacity) * 0.04
      if (i === 0) ref.current.rotation.z = t * 0.28
      if (i === 1) ref.current.rotation.x = t * -0.19
      if (i === 2) ref.current.rotation.y = t * 0.13
    })
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef} position={[2.8, 0.2, 0]}>
        {/* Outer wireframe shell */}
        <mesh>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#a5b4fc"
            wireframe
            transparent
            opacity={0.25}
            emissive="#818cf8"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Inner solid */}
        <mesh>
          <icosahedronGeometry args={[1.65, 1]} />
          <meshStandardMaterial color="#1e1b4b" transparent opacity={0.1} />
        </mesh>

        {/* Core — pulsing on About */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#e0e7ff" emissive="#818cf8" emissiveIntensity={4} />
        </mesh>

        {/* ── About-only orbit rings ── */}
        {/* Ring 1: tilted 25° on X — rotates on Z */}
        <mesh ref={ring1Ref} rotation={[0.44, 0, 0]}>
          <torusGeometry args={[2.6, 0.018, 4, 80]} />
          <meshStandardMaterial
            color="#c7d2fe"
            emissive="#818cf8"
            emissiveIntensity={1.2}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Ring 2: tilted 60° on Z — rotates on X */}
        <mesh ref={ring2Ref} rotation={[0, 0, 1.05]}>
          <torusGeometry args={[2.2, 0.014, 4, 80]} />
          <meshStandardMaterial
            color="#a5b4fc"
            emissive="#6366f1"
            emissiveIntensity={0.9}
            transparent
            opacity={0}
          />
        </mesh>

        {/* Ring 3: near-equatorial — rotates on Y */}
        <mesh ref={ring3Ref} rotation={[1.48, 0.2, 0]}>
          <torusGeometry args={[3.1, 0.010, 4, 80]} />
          <meshStandardMaterial
            color="#e0e7ff"
            emissive="#4f46e5"
            emissiveIntensity={0.6}
            transparent
            opacity={0}
          />
        </mesh>
      </group>
    </Float>
  )
}
