'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { WorkModal, type WorkDetail } from '@/components/ui/WorkModal'
import { VideoModal } from '@/components/ui/VideoModal'
import { defaultWorks, type Work } from '@/content/works'

const SERIF = 'var(--font-cormorant), "EB Garamond", Georgia, serif'

function toCard(w: Work) {
  return {
    ...w,
    type:      (w.mediaType === 'video' ? 'video' : 'photo') as 'video' | 'photo',
    src:       w.mediaUrl,
    thumbnail: w.thumbnailUrl,
    insight:   w.process,
  }
}

export default function MoviePage() {
  const [workModal,  setWorkModal]  = useState<WorkDetail | null>(null)
  const [videoModal, setVideoModal] = useState<Work | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const allWorks = defaultWorks
    .filter(w => w.category === 'movie' && w.visible)
    .sort((a, b) => a.order - b.order)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const container = containerRef.current
    const wrapper = wrapperRef.current
    if (!container || !wrapper) return

    const getScrollAmount = () => {
      const containerWidth = container.scrollWidth
      return -(containerWidth - window.innerWidth)
    }

    const tween = gsap.to(container, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    })

    return () => {
      tween.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const handleClick = (w: Work) => {
    if (w.mediaUrl) setVideoModal(w)
    else            setWorkModal(toCard(w))
  }

  return (
    <main style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--bg-main)' }}>
      {/* ScrollTrigger Wrapper */}
      <div ref={wrapperRef} className="h-screen w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute top-24 left-12 md:left-24 z-10 pointer-events-none">
          <motion.h1
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
          >
            Movie
          </motion.h1>
        </div>

        {/* Horizontal Scroll Container */}
        <div ref={containerRef} className="flex gap-8 px-12 md:px-24 items-center h-[60vh] mt-20">
          {allWorks.map((w, i) => (
            <motion.div
              key={w.id}
              className="relative shrink-0 w-[70vw] md:w-[35vw] h-full group overflow-hidden cursor-pointer"
              onClick={() => handleClick(w)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + (i * 0.1), ease: [0.76, 0, 0.24, 1] }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.thumbnailUrl || w.mediaUrl || ''}
                alt={w.title}
                className="w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] filter grayscale group-hover:grayscale-0 group-hover:scale-[1.05]"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/60 to-transparent opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]">
                <h3 className="text-white text-2xl font-serif font-light">{w.title}</h3>
                <p className="text-white/70 text-xs font-mono tracking-widest uppercase mt-3">{w.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <WorkModal work={workModal} onClose={() => setWorkModal(null)} />
      <VideoModal
        src={videoModal?.mediaUrl}
        title={videoModal?.title}
        tag={videoModal?.tag}
        year={videoModal?.year}
        onClose={() => setVideoModal(null)}
      />
    </main>
  )
}
