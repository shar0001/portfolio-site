'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface MediaCardProps {
  type: 'photo' | 'video'
  src?: string
  thumbnail?: string
  title?: string
  description?: string
  year?: string
  tag?: string
  className?: string
  onClick?: () => void
}

export function MediaCard({
  type, src, thumbnail, title, description, year, tag, className = '', onClick,
}: MediaCardProps) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const [hovering, setHovering] = useState(false)

  const onEnter = () => {
    setHovering(true)
    if (type === 'video' && videoRef.current && src) videoRef.current.play()
  }
  const onLeave = () => {
    setHovering(false)
    if (type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className={`group relative overflow-hidden cursor-pointer ${className}`}
      style={{ border: '1px solid rgba(155,184,255,0.10)', background: '#10152a' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative w-full h-full min-h-[180px]">

        {!src && (
          <div className="absolute inset-0 flex items-end p-4">
            <p className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#3a4470' }}>
              {type === 'video' ? 'Video' : 'Image'}
            </p>
          </div>
        )}

        {type === 'photo' && src && (
          <Image
            src={src}
            alt={title ?? ''}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {type === 'video' && (
          <>
            {thumbnail && !hovering && (
              <Image src={thumbnail} alt={title ?? ''} fill className="object-cover" />
            )}
            {src && (
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hovering ? 'opacity-100' : 'opacity-0'}`}
                muted loop playsInline preload="metadata"
              >
                <source src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}`} type="video/mp4" />
              </video>
            )}
            {!hovering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{ border: '1px solid rgba(155,184,255,0.20)' }}
                >
                  <div
                    className="ml-0.5 transition-opacity duration-300"
                    style={{
                      opacity: hovering ? 0.85 : 0.45,
                      width: 0, height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: '9px solid #c9d1e6',
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {(title || description) && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#10152a] to-transparent pointer-events-none" />
        )}
      </div>

      {(title || description || year || tag) && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {(tag || year) && (
            <p className="font-mono text-[8px] mb-1 tracking-widest uppercase" style={{ color: '#5060a0' }}>
              {tag}{tag && year && ' · '}{year}
            </p>
          )}
          {title && (
            <h3 className="text-sm font-medium leading-tight transition-colors duration-300"
              style={{ color: hovering ? '#e8eeff' : '#c0ccee' }}>
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[11px] mt-1 leading-relaxed line-clamp-2" style={{ color: '#6070a0' }}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
