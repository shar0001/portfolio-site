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
      style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#0a0a0a' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="relative w-full h-full min-h-[180px]">

        {/* Placeholder */}
        {!src && (
          <div className="absolute inset-0 flex items-end p-4">
            <p className="font-mono text-[8px] text-[#2a2828] uppercase tracking-widest">
              {type === 'video' ? 'Video' : 'Image'}
            </p>
          </div>
        )}

        {/* Photo */}
        {type === 'photo' && src && (
          <Image
            src={src}
            alt={title ?? ''}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Video */}
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
                <div className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center transition-all duration-300 group-hover:border-[rgba(255,255,255,0.28)]">
                  <div
                    className="ml-0.5 opacity-40 group-hover:opacity-75 transition-opacity"
                    style={{
                      width: 0, height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: '9px solid #f0f0f0',
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Gradient overlay for info legibility */}
        {(title || description) && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
        )}
      </div>

      {/* Info */}
      {(title || description || year || tag) && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {(tag || year) && (
            <p className="font-mono text-[8px] text-[#383838] mb-1 tracking-widest uppercase">
              {tag}{tag && year && ' · '}{year}
            </p>
          )}
          {title && (
            <h3 className="text-sm font-medium text-[#b0b0b0] group-hover:text-[#d8d8d8] transition-colors leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[11px] text-[#444] mt-1 leading-relaxed line-clamp-2">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
