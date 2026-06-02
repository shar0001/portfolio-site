'use client'
import React, { useRef, useMemo, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ── GLSL shaders ─────────────────────────────────────────────────────────────
const VERTEX_SHADER = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAGMENT_SHADER = /* glsl */`
uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uVelocity;
uniform float uHover;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse;
  float dist = length(uv - mouse);

  // Wave distortion
  float wave = sin(dist * 14.0 - uTime * 2.2) * exp(-dist * 4.0);
  float str = uHover * uVelocity * 0.022;
  uv += vec2(wave) * str;

  // Chromatic aberration
  vec2 dir = normalize(uv - mouse + vec2(0.001));
  float ab = uHover * uVelocity * 0.008;

  float r = texture2D(uTexture, uv + dir * ab).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - dir * ab).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

function encodeImagePath(path: string): string {
  // Encode each path segment (split on '/', encode each part, rejoin)
  return path
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(seg) : seg))
    .join('/')
}

// ── Single plane component ───────────────────────────────────────────────────
interface PlaneProps {
  index: number
  img: string
  scrollRef: React.MutableRefObject<number>
}

function ProjectPlane({ index, img, scrollRef }: PlaneProps) {
  const { size } = useThree()
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef(0)
  const isHoveredRef = useRef(false)
  const lerpedHover = useRef(0)

  const texturePath = BASE + encodeImagePath(img)

  const texture = useTexture(texturePath)

  // Compute plane dimensions based on viewport size
  const planeW = size.width * 0.58
  const planeH = size.height * 0.88

  // Position: x=right side, y stacked vertically per index
  const posX = size.width * 0.2
  const posY = -index * size.height

  // Create shader material per plane (fresh instance per mount)
  const uniforms = useRef({
    uTexture: { value: texture },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uVelocity: { value: 0 },
    uHover: { value: 0 },
    uTime: { value: 0 },
  })

  // Update texture ref when texture changes
  useEffect(() => {
    uniforms.current.uTexture.value = texture
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
  }, [texture])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: uniforms.current,
      transparent: false,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Track mouse and convert to plane-local UV coords
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const viewportH = size.height
    const viewportW = size.width
    const scrollY = scrollRef.current

    // Visibility: show when |scrollY - index*viewportH| < viewportH * 1.5
    const dist = Math.abs(scrollY - index * viewportH)
    const visible = dist < viewportH * 1.5
    meshRef.current.visible = visible

    if (!visible) return

    // Opacity based on scroll proximity
    const normalizedDist = dist / (viewportH * 1.5)
    const opacity = Math.max(0, 1 - normalizedDist * normalizedDist)

    if (material) {
      material.opacity = opacity
      material.transparent = opacity < 1
    }

    // Compute plane screen-space bounds
    // Plane center in world coords: x=posX, y=posY (stacked)
    // In screen coords, center is at:
    const screenCenterX = viewportW / 2 + posX
    const screenCenterY = viewportH / 2 - (posY + scrollY) // compensate for camera scroll

    const halfW = planeW / 2
    const halfH = planeH / 2

    const screenLeft = screenCenterX - halfW
    const screenRight = screenCenterX + halfW
    const screenTop = screenCenterY - halfH
    const screenBottom = screenCenterY + halfH

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    const inBounds =
      mx >= screenLeft &&
      mx <= screenRight &&
      my >= screenTop &&
      my <= screenBottom

    isHoveredRef.current = inBounds

    // Compute UV from mouse position within plane bounds
    if (inBounds) {
      const u = (mx - screenLeft) / planeW
      const v = 1 - (my - screenTop) / planeH // flip Y for UV
      uniforms.current.uMouse.value.set(
        Math.max(0, Math.min(1, u)),
        Math.max(0, Math.min(1, v))
      )
    }

    // Velocity from mouse movement
    const dx = mouseRef.current.x - prevMouseRef.current.x
    const dy = mouseRef.current.y - prevMouseRef.current.y
    const speed = Math.sqrt(dx * dx + dy * dy)
    velocityRef.current += (speed * 0.05 - velocityRef.current) * 0.12
    velocityRef.current = Math.min(velocityRef.current, 3.0)
    prevMouseRef.current.x = mouseRef.current.x
    prevMouseRef.current.y = mouseRef.current.y

    // Lerp hover state
    const targetHover = isHoveredRef.current ? 1 : 0
    lerpedHover.current += (targetHover - lerpedHover.current) * 0.08

    // Update uniforms
    uniforms.current.uVelocity.value = velocityRef.current
    uniforms.current.uHover.value = lerpedHover.current
    uniforms.current.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh
      ref={meshRef}
      position={[posX, posY, 0]}
      material={material}
    >
      <planeGeometry args={[planeW, planeH, 1, 1]} />
    </mesh>
  )
}

// ── ProjectPlanes container ──────────────────────────────────────────────────
interface ProjectPlanesProps {
  scrollRef: React.MutableRefObject<number>
  projects: readonly { cat: string; title: string; meta: string; href: string; img: string }[]
}

export function ProjectPlanes({ scrollRef, projects }: ProjectPlanesProps) {
  return (
    <>
      {projects.map((project, i) => (
        <ProjectPlane
          key={`${project.title}-${i}`}
          index={i + 1} // hero is at scroll 0, first project at 1 * viewportH
          img={project.img}
          scrollRef={scrollRef}
        />
      ))}
    </>
  )
}
