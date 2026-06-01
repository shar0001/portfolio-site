'use client'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

/**
 * ─── Twisted SOLID glass form ─────────────────────────────────────────────────
 *
 * Reference: a single voluminous piece of clear glass — NOT a thin ribbon —
 * that sweeps in a large open arc while twisting on itself. The many flowing
 * diagonal striations come from internal refraction through the twisted solid
 * body, not from separate flat strips.
 *
 * Geometry: an open helical-arc centerline. A solid lens-shaped cross-section
 * (wide but with real thickness) is swept along it and twisted several times —
 * an extruded, twisting glass prism with genuine volume.
 *
 * Material: high-IOR transmission glass, strong chromaticAberration + thin-film
 * iridescence for the prismatic rainbow edges. No self-emission.
 */

// ── Open helical arc centerline ───────────────────────────────────────────────
function createArcCurve(): THREE.CatmullRomCurve3 {
  const Rmaj  = 1.30          // arc radius
  const turns = 1.8           // how much of the circle it sweeps (open arc)
  const rise  = 0.85          // helical depth → gentle coil, not flat ring
  const N     = 360

  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const a = t * turns * Math.PI * 2
    pts.push(new THREE.Vector3(
      Math.cos(a) * Rmaj,
      Math.sin(a) * Rmaj,
      Math.sin(t * Math.PI * 2) * rise,   // coil in/out of the screen
    ))
  }
  // open=false → the ribbon has two free ends that crop off-frame
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
}

// ── Sweep a SOLID lens cross-section along the centerline, twisting ────────────
// The cross-section is a flattened ellipse sampled at `sides` points → a closed
// solid tube with real volume (wide × thinner), not a flat strip.
function buildTwistedSolid(
  curve: THREE.CatmullRomCurve3,
  segments: number,
  semiWidth: number,    // ellipse half-width  (the broad face)
  semiThick: number,    // ellipse half-thickness (the depth → gives volume)
  sides: number,        // points around the cross-section
  twists: number,
): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segments, false)
  const positions: number[] = []
  const uvs:       number[] = []
  const indices:   number[] = []

  // Pre-compute the unit ellipse cross-section profile
  const profile: [number, number][] = []
  for (let s = 0; s < sides; s++) {
    const a = (s / sides) * Math.PI * 2
    profile.push([Math.cos(a), Math.sin(a)])
  }

  for (let i = 0; i <= segments; i++) {
    const t        = i / segments
    const p        = curve.getPointAt(t)
    const normal   = frames.normals[Math.min(i, segments - 1)]
    const binormal = frames.binormals[Math.min(i, segments - 1)]

    const angle = twists * Math.PI * 2 * t
    const cos   = Math.cos(angle)
    const sin   = Math.sin(angle)

    // Twisting width/thick axes
    const wDir = new THREE.Vector3()
      .addScaledVector(binormal,  cos)
      .addScaledVector(normal,    sin)
    const tDir = new THREE.Vector3()
      .addScaledVector(binormal, -sin)
      .addScaledVector(normal,    cos)

    // Body swells in the middle, tapers toward the cropped ends
    const swell = 0.55 + 0.45 * Math.sin(t * Math.PI)
    const hw = semiWidth * swell
    const ht = semiThick * swell

    for (let s = 0; s < sides; s++) {
      const [cu, cv] = profile[s]
      positions.push(
        p.x + wDir.x * hw * cu + tDir.x * ht * cv,
        p.y + wDir.y * hw * cu + tDir.y * ht * cv,
        p.z + wDir.z * hw * cu + tDir.z * ht * cv,
      )
      uvs.push(t, s / sides)
    }
  }

  // Stitch consecutive cross-section rings into a closed solid tube
  for (let i = 0; i < segments; i++) {
    const i0 = i * sides
    const i1 = (i + 1) * sides
    for (let s = 0; s < sides; s++) {
      const sn = (s + 1) % sides
      const a = i0 + s
      const b = i0 + sn
      const d = i1 + sn
      const e = i1 + s
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
    () => buildTwistedSolid(
      createArcCurve(),
      mobile ? 260 : 520,
      0.62,            // semi-width  — broad face of the glass
      0.26,            // semi-thick  — real depth → solid volume, not a strip
      mobile ? 16 : 24, // cross-section resolution
      3.0,             // twists → flowing internal striations
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

    lag.current.x += (pointer.y * -0.40 - lag.current.x) * 0.04
    lag.current.y += (pointer.x *  0.45 - lag.current.y) * 0.04

    groupRef.current.rotation.x = t * 0.030 + lag.current.x + 0.35
    groupRef.current.rotation.y = t * 0.050 + lag.current.y + 0.20
    groupRef.current.rotation.z = Math.sin(t * 0.12) * 0.06

    pulse.current = Math.max(0, pulse.current - delta * 1.6)
    const breathe = 1 + Math.sin(t * 0.4) * 0.010
    const kick    = pulse.current * 0.04
    groupRef.current.scale.setScalar((mobile ? 1.55 : 2.05) * (breathe + kick))
  })

  return (
    <group
      ref={groupRef}
      position={[mobile ? 0.15 : 0.35, 0, 0]}
      scale={mobile ? 1.55 : 2.05}
    >
      <mesh geometry={geo}>
        {mobile ? (
          <meshPhysicalMaterial
            color="#46599c"
            metalness={0}
            roughness={0.02}
            transmission={0.95}
            thickness={0.8}
            ior={1.55}
            iridescence={1}
            iridescenceIOR={1.95}
            iridescenceThicknessRange={[40, 880]}
            envMapIntensity={3.8}
            attenuationColor="#0c1aa8"
            attenuationDistance={0.9}
            clearcoat={1}
            clearcoatRoughness={0.02}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={14}
            resolution={1024}
            transmission={1}
            thickness={0.7}
            roughness={0.015}
            ior={1.58}
            chromaticAberration={1.9}        // ← intense rainbow dispersion
            anisotropicBlur={0.03}
            distortion={0.06}
            distortionScale={0.15}
            temporalDistortion={0.03}
            iridescence={1}
            iridescenceIOR={1.95}
            iridescenceThicknessRange={[40, 960]}
            envMapIntensity={3.8}
            color="#4659a0"
            attenuationColor="#0c1aa8"
            attenuationDistance={0.85}
            background={new THREE.Color('#000003')}
            clearcoat={1}
            clearcoatRoughness={0.01}
          />
        )}
      </mesh>
    </group>
  )
}
