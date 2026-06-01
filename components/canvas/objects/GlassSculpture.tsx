'use client'
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Trefoil knot sampled into a CatmullRom spline
function createTrefoilCurve(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = []
  const N = 240
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    pts.push(new THREE.Vector3(
      (Math.sin(a) + 2 * Math.sin(2 * a)) * 0.50,
      (Math.cos(a) - 2 * Math.cos(2 * a)) * 0.50,
      -Math.sin(3 * a) * 0.50,
    ))
  }
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
}

export function GlassSculpture() {
  const groupRef = useRef<THREE.Group>(null)
  const matRef   = useRef<THREE.MeshPhysicalMaterial>(null)
  const { pointer } = useThree()
  const lag = useRef({ x: 0, y: 0 })

  // Tube: 360 path segments, radius 0.060, 10 radial segments, closed
  const geo = useMemo(
    () => new THREE.TubeGeometry(createTrefoilCurve(), 360, 0.060, 10, true),
    [],
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    // Pointer-reactive inertia
    lag.current.x += (pointer.y * -0.20 - lag.current.x) * 0.04
    lag.current.y += (pointer.x *  0.20 - lag.current.y) * 0.04

    groupRef.current.rotation.x = t * 0.068 + lag.current.x
    groupRef.current.rotation.y = t * 0.108 + lag.current.y
    groupRef.current.rotation.z = t * 0.032

    // Subtle breathing
    const s = 1 + Math.sin(t * 0.38) * 0.014
    groupRef.current.scale.setScalar(s)

    // Animate iridescence thickness for dynamic shimmer
    if (matRef.current) {
      matRef.current.iridescenceThicknessRange = [
        130 + Math.sin(t * 0.31) * 55,
        430 + Math.cos(t * 0.22) * 85,
      ]
    }
  })

  return (
    <group ref={groupRef} position={[1.4, -0.1, 0]}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          ref={matRef}
          color="#bcceff"
          metalness={0.0}
          roughness={0.022}
          // Glass — transmission + refraction
          transmission={0.80}
          thickness={0.45}
          ior={1.52}
          // Rainbow iridescence thin-film effect
          iridescence={1.0}
          iridescenceIOR={1.85}
          iridescenceThicknessRange={[130, 430]}
          // Strong env map for reflections
          envMapIntensity={3.0}
          // Blue attenuation through glass body
          attenuationColor="#7888e0"
          attenuationDistance={1.6}
        />
      </mesh>
    </group>
  )
}
