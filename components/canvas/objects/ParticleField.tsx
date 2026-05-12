'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function ParticleField({ count }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const particleCount = count ?? (mobile ? 600 : 2500)

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 35
      arr[i * 3 + 1] = (Math.random() - 0.5) * 35
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [particleCount])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.012
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.004) * 0.08
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#ffffff"
        transparent
        opacity={0.22}
        sizeAttenuation
      />
    </points>
  )
}
