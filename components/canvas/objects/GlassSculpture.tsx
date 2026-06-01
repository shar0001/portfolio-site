'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Dense toroidal-helix ribbon.
 *
 * The path winds `loops` times around the minor circle of a torus for every
 * single revolution around the major axis. With 10 loops and ribbon width
 * nearly equal to the inter-loop spacing, the bands pack tightly into a
 * compact sphere-like mass — matching the reference's layered glass coil.
 *
 * Material: full transmission glass, chromatic dispersion (rainbow edges),
 * iridescence (thin-film colour shifts). No emissive glow.
 */

// ── Toroidal helix centerline ─────────────────────────────────────────────────
function createHelixCurve(): THREE.CatmullRomCurve3 {
  const R     = 0.82   // major radius
  const r     = 0.72   // minor radius — large → compact, sphere-like mass
  const loops = 10     // minor-circle windings per major revolution
  const N     = 600    // pre-sample density

  const pts: THREE.Vector3[] = []
  for (let i = 0; i < N; i++) {
    const u   = (i / N) * Math.PI * 2
    const phi = loops * u
    pts.push(new THREE.Vector3(
      (R + r * Math.cos(phi)) * Math.cos(u),
       r * Math.sin(phi),
      (R + r * Math.cos(phi)) * Math.sin(u),
    ))
  }
  // closed=true — last point wraps cleanly back to first (both at u=0)
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
}

// ── Swept ribbon geometry ─────────────────────────────────────────────────────
function buildRibbon(
  curve: THREE.CatmullRomCurve3,
  segments: number,
  width: number,
  thickness: number,
  twists: number,
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, true)
  const positions: number[] = []
  const uvs:       number[] = []
  const indices:   number[] = []

  // Thin-rectangle cross-section: 4 corners (widthDir × thickDir)
  const corners = [[-1,  1], [ 1,  1], [ 1, -1], [-1, -1]] as const

  for (let i = 0; i < segments; i++) {
    const t        = i / segments
    const p        = curve.getPointAt(t)
    const tangent  = frames.tangents[i]
    const normal   = frames.normals[i]
    const binormal = frames.binormals[i]

    // Rotate the cross-section frame around the tangent
    const angle = twists * Math.PI * 2 * t
    const cos   = Math.cos(angle)
    const sin   = Math.sin(angle)

    const wDir = new THREE.Vector3()
      .addScaledVector(binormal,  cos)
      .addScaledVector(normal,    sin)
    const tDir = new THREE.Vector3()
      .addScaledVector(binormal, -sin)
      .addScaledVector(normal,    cos)

    // Gentle taper for organic silhouette
    const hw = width     * 0.5 * (0.85 + 0.15 * Math.sin(t * Math.PI * 8))
    const ht = thickness * 0.5

    for (const [u, v] of corners) {
      positions.push(
        p.x + wDir.x * hw * u + tDir.x * ht * v,
        p.y + wDir.y * hw * u + tDir.y * ht * v,
        p.z + wDir.z * hw * u + tDir.z * ht * v,
      )
      uvs.push(t, (u + 1) * 0.5)
    }
  }

  // Connect consecutive rings: 4 quads per ring pair
  for (let i = 0; i < segments; i++) {
    const i0 = i * 4
    const i1 = ((i + 1) % segments) * 4
    for (let c = 0; c < 4; c++) {
      const a = i0 + c
      const b = i0 + ((c + 1) % 4)
      const d = i1 + ((c + 1) % 4)
      const e = i1 + c
      indices.push(a, b, d, a, d, e)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export function GlassSculpture({ mobile = false }: { mobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const lag   = useRef({ x: 0, y: 0 })
  const pulse = useRef(0)

  const geo = useMemo(
    () => buildRibbon(
      createHelixCurve(),
      mobile ? 360 : 720,  // segments — heavier on desktop
      0.44,                // wide flat ribbon
      0.038,               // very thin (sharp visible edges)
      2.0,                 // extra twist on top of natural Frenet rotation
    ),
    [mobile],
  )
  useEffect(() => () => geo.dispose(), [geo])

  useEffect(() => {
    const trigger = () => { pulse.current = 1 }
    window.addEventListener('pointerdown', trigger, { passive: true })
    return () => window.removeEventListener('pointerdown', trigger)
  }, [])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    lag.current.x += (pointer.y * -0.45 - lag.current.x) * 0.04
    lag.current.y += (pointer.x *  0.50 - lag.current.y) * 0.04

    // Pre-rotated start angle → nicer initial composition
    groupRef.current.rotation.x = t * 0.038 + lag.current.x + 0.42
    groupRef.current.rotation.y = t * 0.062 + lag.current.y + 0.65
    groupRef.current.rotation.z = Math.sin(t * 0.15) * 0.08

    pulse.current = Math.max(0, pulse.current - delta * 1.6)
    const breathe = 1 + Math.sin(t * 0.4) * 0.010
    const kick    = pulse.current * 0.04
    groupRef.current.scale.setScalar((mobile ? 1.65 : 2.2) * (breathe + kick))
  })

  return (
    <group
      ref={groupRef}
      position={[mobile ? 0.30 : 0.60, 0, 0]}
      scale={mobile ? 1.65 : 2.2}
    >
      <mesh geometry={geo}>
        {mobile ? (
          // Mobile: lighter physical glass (no buffer render)
          <meshPhysicalMaterial
            color="#5565a8"
            metalness={0}
            roughness={0.04}
            transmission={0.92}
            thickness={0.7}
            ior={1.50}
            iridescence={1}
            iridescenceIOR={1.80}
            iridescenceThicknessRange={[80, 760]}
            envMapIntensity={3.0}
            attenuationColor="#1020a8"
            attenuationDistance={0.9}
            clearcoat={1}
            clearcoatRoughness={0.03}
          />
        ) : (
          // Desktop: full transmission + chromatic dispersion + iridescence
          <MeshTransmissionMaterial
            samples={12}
            resolution={1024}
            transmission={1}
            thickness={0.6}
            roughness={0.03}
            ior={1.52}
            chromaticAberration={1.3}
            anisotropicBlur={0.06}
            distortion={0.10}
            distortionScale={0.22}
            temporalDistortion={0.05}
            iridescence={1}
            iridescenceIOR={1.82}
            iridescenceThicknessRange={[80, 820]}
            envMapIntensity={3.2}
            color="#6070b0"
            attenuationColor="#1020b0"
            attenuationDistance={0.85}
            background={new THREE.Color('#000008')}
            clearcoat={1}
            clearcoatRoughness={0.02}
          />
        )}
      </mesh>
    </group>
  )
}
