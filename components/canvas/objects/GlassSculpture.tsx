'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ─── Twisted iridescent glass RIBBON ───────────────────────────────────────
 *
 * Geometry: a custom BufferGeometry, NOT a tube. A 3D spline centerline is
 * sampled, Frenet frames are computed, and a thin rectangular cross-section
 * (wide + shallow) is swept along the path while twisting — producing a flat
 * folded glass strip with real width, slight thickness, and sharp edges.
 *
 * Material: glass via transmission + refraction, rainbow via chromatic
 * dispersion (chromaticAberration) and thin-film iridescence. No self-emission.
 */

// ── Centerline: an organic, asymmetric, folding loop ──────────────────────────
function createRibbonCurve(): THREE.CatmullRomCurve3 {
  const pts = [
    new THREE.Vector3(-1.65, -1.75, 0.05),
    new THREE.Vector3(-0.35, -1.25, 0.95),
    new THREE.Vector3( 0.95, -0.35, -0.45),
    new THREE.Vector3( 0.65,  0.95, 0.75),
    new THREE.Vector3(-0.55,  1.55, -0.35),
    new THREE.Vector3(-1.45,  0.60, 0.65),
    new THREE.Vector3(-0.90, -0.50, -0.70),
    new THREE.Vector3( 0.25, -1.05, 0.30),
  ]
  return new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.55)
}

// ── Build the ribbon as a swept, twisting flat strip ──────────────────────────
function buildRibbon(
  curve: THREE.CatmullRomCurve3,
  segments: number,
  width: number,
  thickness: number,
  twists: number,
): THREE.BufferGeometry {
  const closed = true
  const frames = curve.computeFrenetFrames(segments, closed)
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Thin rectangle cross-section corners in (widthDir, thickDir): u, v ∈ {-1,1}
  const corners = [
    [-1,  1], [ 1,  1], [ 1, -1], [-1, -1],
  ]

  const rings = closed ? segments : segments + 1

  for (let i = 0; i < rings; i++) {
    const t = i / segments
    const p = curve.getPointAt(t % 1)
    const tangent  = frames.tangents[i % frames.tangents.length]
    const normal   = frames.normals[i % frames.normals.length]
    const binormal = frames.binormals[i % frames.binormals.length]

    // Twist the cross-section frame around the tangent as we travel
    const angle = twists * Math.PI * 2 * t
    const cos = Math.cos(angle), sin = Math.sin(angle)
    const widthDir = new THREE.Vector3()
      .addScaledVector(binormal, cos)
      .addScaledVector(normal,   sin)
    const thickDir = new THREE.Vector3()
      .addScaledVector(binormal, -sin)
      .addScaledVector(normal,    cos)

    // Width tapers gently along the path for an organic silhouette
    const hw = width  * 0.5 * (0.78 + 0.22 * Math.sin(t * Math.PI * 2 + 0.6))
    const ht = thickness * 0.5

    for (let c = 0; c < 4; c++) {
      const [u, v] = corners[c]
      positions.push(
        p.x + widthDir.x * hw * u + thickDir.x * ht * v,
        p.y + widthDir.y * hw * u + thickDir.y * ht * v,
        p.z + widthDir.z * hw * u + thickDir.z * ht * v,
      )
      uvs.push(t, c / 4)
    }
  }

  // Connect consecutive rings → 4 quads each (top, edge, bottom, edge)
  const ringCount = rings
  const limit = closed ? ringCount : ringCount - 1
  for (let i = 0; i < limit; i++) {
    const i0 = i * 4
    const i1 = ((i + 1) % ringCount) * 4
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
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

export function GlassSculpture({ mobile = false }: { mobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const lag   = useRef({ x: 0, y: 0 })
  const pulse = useRef(0)   // 0..1, decays — click reaction

  // Geometry — heavier on desktop, lighter on mobile
  const geo = useMemo(
    () => buildRibbon(
      createRibbonCurve(),
      mobile ? 220 : 440,   // path segments
      0.62,                 // width
      0.055,                // thickness
      2.5,                  // number of twists along the loop
    ),
    [mobile],
  )
  useEffect(() => () => geo.dispose(), [geo])

  // Click / tap → brief pulse + spectral intensify
  useEffect(() => {
    const trigger = () => { pulse.current = 1 }
    window.addEventListener('pointerdown', trigger, { passive: true })
    return () => window.removeEventListener('pointerdown', trigger)
  }, [])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime

    // Pointer-reactive rotation — object turns toward the cursor with inertia
    lag.current.x += (pointer.y * -0.45 - lag.current.x) * 0.045
    lag.current.y += (pointer.x *  0.55 - lag.current.y) * 0.045

    groupRef.current.rotation.x = t * 0.045 + lag.current.x
    groupRef.current.rotation.y = t * 0.075 + lag.current.y
    groupRef.current.rotation.z = Math.sin(t * 0.18) * 0.10

    // Decay click pulse → subtle breathing scale
    pulse.current = Math.max(0, pulse.current - delta * 1.6)
    const breathe = 1 + Math.sin(t * 0.4) * 0.012
    const kick = pulse.current * 0.05
    groupRef.current.scale.setScalar((mobile ? 1.5 : 1.85) * (breathe + kick))
  })

  return (
    <group ref={groupRef} position={[mobile ? 0.4 : 1.15, 0.05, 0]} scale={mobile ? 1.5 : 1.85}>
      <mesh geometry={geo}>
        {mobile ? (
          // Mobile: lighter physical glass (no buffer render)
          <meshPhysicalMaterial
            color="#aac4ff"
            metalness={0}
            roughness={0.06}
            transmission={0.92}
            thickness={0.6}
            ior={1.46}
            iridescence={1}
            iridescenceIOR={1.6}
            iridescenceThicknessRange={[120, 560]}
            envMapIntensity={2.2}
            attenuationColor="#5e76d8"
            attenuationDistance={1.4}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        ) : (
          // Desktop: full transmission + chromatic dispersion + iridescence
          <MeshTransmissionMaterial
            samples={10}
            resolution={1024}
            transmission={1}
            thickness={0.55}
            roughness={0.04}
            ior={1.5}
            chromaticAberration={0.85}     // ← rainbow dispersion strength
            anisotropicBlur={0.12}
            distortion={0.18}
            distortionScale={0.4}
            temporalDistortion={0.08}
            iridescence={1}
            iridescenceIOR={1.65}
            iridescenceThicknessRange={[120, 600]}
            envMapIntensity={2.4}
            color="#cfe0ff"
            attenuationColor="#6076d8"
            attenuationDistance={1.6}
            background={new THREE.Color('#05070f')}
            clearcoat={1}
            clearcoatRoughness={0.04}
          />
        )}
      </mesh>
    </group>
  )
}
