'use client'
import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  scrollRef: React.MutableRefObject<number>
}

export function CameraRig({ scrollRef }: CameraRigProps) {
  const { camera, size } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const lerpedMouse = useRef({ x: 0, y: 0 })
  const lerpedScrollY = useRef(0)

  // Set up camera with 1:1 pixel mapping
  useEffect(() => {
    const perspCam = camera as THREE.PerspectiveCamera
    const H = size.height
    const fov = 2 * Math.atan(H / (2 * 800)) * (180 / Math.PI)
    perspCam.fov = fov
    perspCam.position.z = 800
    perspCam.near = 0.1
    perspCam.far = 10000
    perspCam.updateProjectionMatrix()
  }, [camera, size])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    const perspCam = camera as THREE.PerspectiveCamera

    // Lerp scroll
    lerpedScrollY.current += (scrollRef.current - lerpedScrollY.current) * 0.1

    // Lerp mouse
    lerpedMouse.current.x += (mouseRef.current.x - lerpedMouse.current.x) * 0.08
    lerpedMouse.current.y += (mouseRef.current.y - lerpedMouse.current.y) * 0.08

    // Scroll: camera moves down the scene (negative Y matches DOM scroll down)
    perspCam.position.y = -lerpedScrollY.current

    // Subtle parallax from mouse
    perspCam.position.x = lerpedMouse.current.x * 20

    // Look at center of current scroll position with very slight offset
    perspCam.lookAt(
      lerpedMouse.current.x * 8,
      -lerpedScrollY.current + lerpedMouse.current.y * 8,
      0
    )
  })

  return null
}
