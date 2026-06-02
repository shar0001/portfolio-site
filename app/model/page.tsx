'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  heroImage, galleryImages, aspectFor,
  type ModelImage,
} from '@/content/model'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'
const TEXT  = 'var(--text-primary)'
const MUTED = 'var(--text-secondary)'
const DIM   = 'var(--text-muted)'
const LINE  = 'var(--line-soft)'
const BASE  = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/')
const url = (p: string) => `${BASE}${enc(p)}`

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10"
      style={{ background: 'rgba(3,4,8,0.96)', backdropFilter: 'blur(16px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
    >
      <motion.img
        // eslint-disable-next-line @next/next/no-img-element
        src={src}
        alt={alt}
        className="max-w-full max-h-full"
        style={{ objectFit: 'contain', boxShadow: '0 0 90px rgba(0,0,0,0.85)' }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-5 right-6 font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-200"
        style={{ color: 'rgba(232,224,206,0.42)' }}
        onClick={onClose}
      >
        Close ✕
      </button>
    </motion.div>
  )
}

function ParallaxImage({ img, onOpen }: { img: ModelImage; onOpen: (src: string, alt: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return
    
    gsap.registerPlugin(ScrollTrigger)
    
    // Parallax effect: image moves slightly slower/faster than container
    gsap.fromTo(image, 
      { y: -40 }, 
      {
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    )
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-zoom-in group mb-12 md:mb-20"
      style={{ aspectRatio: aspectFor[img.orientation], backgroundColor: 'var(--glass-bg)' }}
      onClick={() => onOpen(url(img.src), img.alt)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={url(img.src)}
        alt={img.alt}
        className="absolute top-[-40px] left-0 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-[1.03]"
        style={{ height: 'calc(100% + 80px)', objectPosition: img.position ?? 'center center' }}
        loading="lazy"
      />
    </div>
  )
}

export default function ModelPage() {
  const [lightboxSrc, setLightboxSrc] = useState('')
  const [lightboxAlt, setLightboxAlt] = useState('')
  const allImages = [heroImage, ...galleryImages]

  return (
    <>
      <main className="min-h-screen relative z-10 px-6 md:px-12 pt-24 md:pt-32 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-12 md:gap-24">
          
          {/* Left Column: 30% Sticky */}
          <div className="md:col-span-3">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <h1
                  className="leading-[0.92] mb-4"
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 300,
                    fontSize: 'clamp(3rem, 5vw, 4.6rem)',
                    letterSpacing: '-0.02em',
                    color: TEXT,
                  }}
                >
                  Shusaku<br />Nishiura
                </h1>
                <p className="font-mono text-[9px] tracking-[0.32em] uppercase mb-12" style={{ color: DIM }}>
                  Campaign · Editorial · Jewelry
                </p>

                {/* Profile Details */}
                <div className="flex flex-col gap-4 text-[12px] font-sans" style={{ color: MUTED }}>
                  <div className="flex justify-between border-b pb-2" style={{ borderColor: LINE }}>
                    <span>Agency</span>
                    <span>bravo models</span>
                  </div>
                  <div className="flex justify-between border-b pb-2" style={{ borderColor: LINE }}>
                    <span>Base</span>
                    <span>Tokyo, Japan</span>
                  </div>
                  <div className="flex justify-between border-b pb-2" style={{ borderColor: LINE }}>
                    <span>Active</span>
                    <span>2018 — Present</span>
                  </div>
                </div>

                {/* Credits / Selected Works */}
                <div className="mt-12">
                  <p className="font-mono text-[8px] tracking-[0.5em] uppercase mb-6" style={{ color: DIM }}>
                    Selected Works
                  </p>
                  <div className="mb-6">
                    <p className="text-sm tracking-wide" style={{ fontFamily: SERIF, color: TEXT }}>Van Cleef & Arpels</p>
                    <p className="text-[10px] italic mt-1" style={{ fontFamily: SERIF, color: MUTED }}>スー レ ゼトワール〈星空の下で〉</p>
                    <p className="font-mono text-[8px] mt-2" style={{ color: DIM }}>2024</p>
                  </div>
                  <div>
                    <p className="text-sm tracking-wide" style={{ fontFamily: SERIF, color: TEXT }}>MIKIMOTO</p>
                    <p className="text-[10px] italic mt-1" style={{ fontFamily: SERIF, color: MUTED }}>Lucky Arrows</p>
                    <p className="font-mono text-[8px] mt-2" style={{ color: DIM }}>2024</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: 70% Scrolling Media */}
          <div className="md:col-span-7 mt-12 md:mt-0">
            {allImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: i * 0.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <ParallaxImage img={img} onOpen={(src, alt) => { setLightboxSrc(src); setLightboxAlt(alt) }} />
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => setLightboxSrc('')} />
        )}
      </AnimatePresence>
    </>
  )
}
