'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HeroObjectsProps {
  scrollRef: React.MutableRefObject<number>
}

export function HeroObjects({ scrollRef }: HeroObjectsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const mesh1Ref = useRef<THREE.Mesh>(null)
  const mesh2Ref = useRef<THREE.Mesh>(null)
  const mesh3Ref = useRef<THREE.Mesh>(null)
  const [viewportH, setViewportH] = useState(0)
  const lerpedMouse = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setViewportH(window.innerHeight)
    const handleResize = () => setViewportH(window.innerHeight)
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    // Lerp mouse
    lerpedMouse.current.x += (mouseRef.current.x - lerpedMouse.current.x) * 0.05
    lerpedMouse.current.y += (mouseRef.current.y - lerpedMouse.current.y) * 0.05

    const t = clock.getElapsedTime()

    // Compute fade opacity based on scroll
    const vh = viewportH > 0 ? viewportH : window.innerHeight
    const rawFade = scrollRef.current / vh
    const fade = Math.max(0, Math.min(1, rawFade))
    groupRef.current.visible = fade < 0.99

    // Apply fade to all children materials
    groupRef.current.children.forEach((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial
        if (!mat.transparent) mat.transparent = true
        mat.opacity = 1 - fade
      }
    })

    // Auto-rotate objects slowly
    if (mesh1Ref.current) {
      mesh1Ref.current.rotation.x = 0.3 + t * 0.09
      mesh1Ref.current.rotation.y = 0.5 + t * 0.12
      // Mouse parallax (multiplier 0.8)
      mesh1Ref.current.position.x = 280 + lerpedMouse.current.x * 0.8 * 30
      mesh1Ref.current.position.y = 120 + lerpedMouse.current.y * 0.8 * 20
    }

    if (mesh2Ref.current) {
      mesh2Ref.current.rotation.x = 0.8 + t * 0.07
      mesh2Ref.current.rotation.y = 0.2 + t * 0.10
      mesh2Ref.current.rotation.z = 0.4 + t * 0.05
      // Mouse parallax (multiplier 0.5)
      mesh2Ref.current.position.x = -200 + lerpedMouse.current.x * 0.5 * 30
      mesh2Ref.current.position.y = -60 + lerpedMouse.current.y * 0.5 * 20
    }

    if (mesh3Ref.current) {
      mesh3Ref.current.rotation.x = t * 0.06
      mesh3Ref.current.rotation.y = t * 0.08
      // Mouse parallax (multiplier 1.1)
      mesh3Ref.current.position.x = 340 + lerpedMouse.current.x * 1.1 * 30
      mesh3Ref.current.position.y = -180 + lerpedMouse.current.y * 1.1 * 20
    }
  })

  return (
    <group ref={groupRef}>
      {/* Object 1: large icosahedron, top-right area */}
      <mesh ref={mesh1Ref} position={[280, 120, -100]} rotation={[0.3, 0.5, 0.1]}>
        <icosahedronGeometry args={[140, 1]} />
        <meshPhysicalMaterial
          color="#f4f4f0"
          roughness={0.12}
          metalness={0.04}
        />
      </mesh>

      {/* Object 2: torus knot, center-left */}
      <mesh ref={mesh2Ref} position={[-200, -60, -200]} rotation={[0.8, 0.2, 0.4]}>
        <torusKnotGeometry args={[70, 22, 128, 16]} />
        <meshPhysicalMaterial
          color="#ece8e0"
          roughness={0.20}
          metalness={0.02}
        />
      </mesh>

      {/* Object 3: small sphere, bottom-right */}
      <mesh ref={mesh3Ref} position={[340, -180, -80]}>
        <sphereGeometry args={[55, 32, 32]} />
        <meshPhysicalMaterial
          color="#f0ece4"
          roughness={0.08}
          metalness={0.06}
        />
      </mesh>
    </group>
  )
}
