'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Dense toroidal-helix ribbon — matching reference:
 * clear donut hole, ~8 ribbon bands wrapping the tube surface,
 * dark blue steel body, extreme chromatic dispersion on every edge.
 *
 * Key geometry:  R=1.15 (major), r=0.52 (minor) → inner hole radius 0.63
 * (clearly visible). 8 minor-circle windings pack ribbon bands edge-to-edge.
 */

function createHelixCurve(): THREE.CatmullRomCurve3 {
  const R     = 1.15   // major radius — larger → visible hole in centre
  const r     = 0.52   // minor radius — smaller → compact tube with clear ring
  const loops = 8      // ribbon bands visible around the ring
  const N     = 512

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
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.5)
}

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

  const corners = [[-1,  1], [ 1,  1], [ 1, -1], [-1, -1]] as const

  for (let i = 0; i < segments; i++) {
    const t        = i / segments
    const p        = curve.getPointAt(t)
    const normal   = frames.normals[i]
    const binormal = frames.binormals[i]

    const angle = twists * Math.PI * 2 * t
    const cos   = Math.cos(angle)
    const sin   = Math.sin(angle)

    const wDir = new THREE.Vector3()
      .addScaledVector(binormal,  cos)
      .addScaledVector(normal,    sin)
    const tDir = new THREE.Vector3()
      .addScaledVector(binormal, -sin)
      .addScaledVector(normal,    cos)

    // Subtle taper — keeps silhouette organic
    const hw = width     * 0.5 * (0.88 + 0.12 * Math.sin(t * Math.PI * 10))
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
      mobile ? 320 : 640,
      0.42,    // wide ribbon — fills ~95% of inter-band spacing
      0.034,   // very thin sharp edge
      1.0,     // slight extra twist on top of Frenet frame rotation
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

    // Tilt so the ring hole is visible from the start (~28° forward, ~17° side)
    groupRef.current.rotation.x = t * 0.036 + lag.current.x + 0.50
    groupRef.current.rotation.y = t * 0.058 + lag.current.y + 0.30
    groupRef.current.rotation.z = Math.sin(t * 0.14) * 0.07

    pulse.current = Math.max(0, pulse.current - delta * 1.6)
    const breathe = 1 + Math.sin(t * 0.4) * 0.010
    const kick    = pulse.current * 0.04
    groupRef.current.scale.setScalar((mobile ? 1.45 : 1.90) * (breathe + kick))
  })

  return (
    <group
      ref={groupRef}
      position={[mobile ? 0.20 : 0.40, -0.10, 0]}
      scale={mobile ? 1.45 : 1.90}
    >
      <mesh geometry={geo}>
        {mobile ? (
          <meshPhysicalMaterial
            color="#3a4890"
            metalness={0}
            roughness={0.03}
            transmission={0.94}
            thickness={0.7}
            ior={1.50}
            iridescence={1}
            iridescenceIOR={1.90}
            iridescenceThicknessRange={[60, 820]}
            envMapIntensity={3.5}
            attenuationColor="#0a18a0"
            attenuationDistance={0.75}
            clearcoat={1}
            clearcoatRoughness={0.02}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={12}
            resolution={1024}
            transmission={1}
            thickness={0.55}
            roughness={0.02}
            ior={1.54}
            chromaticAberration={1.6}
            anisotropicBlur={0.04}
            distortion={0.08}
            distortionScale={0.18}
            temporalDistortion={0.04}
            iridescence={1}
            iridescenceIOR={1.92}
            iridescenceThicknessRange={[60, 900]}
            envMapIntensity={3.5}
            color="#3a4890"
            attenuationColor="#0a18a0"
            attenuationDistance={0.72}
            background={new THREE.Color('#000005')}
            clearcoat={1}
            clearcoatRoughness={0.01}
          />
        )}
      </mesh>
    </group>
  )
}
