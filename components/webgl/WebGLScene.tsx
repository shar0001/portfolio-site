'use client'
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { CameraRig } from './CameraRig'
import { HeroObjects } from './HeroObjects'
import { ProjectPlanes } from './ProjectPlanes'

export const PROJECTS = [
  { cat: 'Editorial', title: 'Model Archive',       meta: '2022 — 25', href: '/model', img: '/media/韓国.jpeg' },
  { cat: 'iOS',       title: 'Pittanko App',         meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'iOS',       title: 'Kakeibo App',          meta: 'App',       href: '/apps',  img: '/media/素材01.jpg' },
  { cat: 'Motion',    title: 'Motion Reel',          meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Film',      title: 'AI Video Experiments', meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Brand',     title: 'Marketing Tests',      meta: '2025',      href: '/movie', img: '/media/MIKIMOTO.jpg' },
  { cat: 'Portrait',  title: 'Portrait Archive',     meta: 'ELLE',      href: '/model', img: '/media/ELLE JAPON × Van Cleef & Arpels.jpg' },
] as const

interface WebGLSceneProps {
  scrollRef: React.MutableRefObject<number>
}

export function WebGLScene({ scrollRef }: WebGLSceneProps) {
  return (
    <div className="webgl-canvas-wrap">
      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: '#0a0a0a', width: '100%', height: '100%' }}
      >
        {/* Lights */}
        <ambientLight intensity={0.25} />
        <pointLight position={[200, 300, 400]} intensity={1.4} color="#fff8f0" />
        <pointLight position={[-250, -200, 200]} intensity={0.5} color="#c8b99a" />

        {/* Camera and scene contents */}
        <CameraRig scrollRef={scrollRef} />
        <HeroObjects scrollRef={scrollRef} />
        <ProjectPlanes scrollRef={scrollRef} projects={PROJECTS} />
      </Canvas>
    </div>
  )
}
