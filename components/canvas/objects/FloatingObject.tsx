'use client'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { sceneState } from '@/lib/sceneState'

export function FloatingObject() {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (groupRef.current) sceneState.objectGroupRef = groupRef.current
    return () => { sceneState.objectGroupRef = null }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.08
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={groupRef} position={[2.8, 0.2, 0]}>
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
        <mesh>
          <icosahedronGeometry args={[1.65, 1]} />
          <meshStandardMaterial color="#1e1b4b" transparent opacity={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#e0e7ff" emissive="#818cf8" emissiveIntensity={4} />
        </mesh>
      </group>
    </Float>
  )
}
