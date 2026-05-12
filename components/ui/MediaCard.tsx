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
}

export function MediaCard({
  type,
  src,
  thumbnail,
  title,
  description,
  year,
  tag,
  className = '',
}: MediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    if (type === 'video' && videoRef.current && src) videoRef.current.play()
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (type === 'video' && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <div
      className={`group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:border-[var(--border-hover)] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media area */}
      <div className="relative w-full h-full min-h-[180px] bg-[#0a0a0a]">
        {/* Placeholder when no src */}
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.08)] mx-auto flex items-center justify-center">
                {type === 'video' ? (
                  <span className="text-[#303030] text-xs">▶</span>
                ) : (
                  <span className="text-[#303030] text-xs">⬜</span>
                )}
              </div>
              <p className="font-mono text-[9px] text-[#282828] uppercase tracking-widest">
                {type === 'video' ? 'Video' : 'Photo'}
              </p>
            </div>
          </div>
        )}

        {/* Photo */}
        {type === 'photo' && src && (
          <Image
            src={src}
            alt={title ?? 'media'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}

        {/* Video */}
        {type === 'video' && (
          <>
            {thumbnail && !isHovering && (
              <Image src={thumbnail} alt={title ?? 'video thumbnail'} fill className="object-cover" />
            )}
            {src && (
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  isHovering ? 'opacity-100' : 'opacity-0'
                }`}
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={src} type="video/mp4" />
              </video>
            )}
            {/* Play icon */}
            {!isHovering && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-[rgba(255,255,255,0.12)] flex items-center justify-center backdrop-blur-sm transition-all duration-300 group-hover:border-[rgba(255,255,255,0.3)] group-hover:scale-110">
                  <div
                    className="ml-1 opacity-50 group-hover:opacity-90 transition-opacity"
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: '10px solid #f0f0f0',
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Gradient overlay */}
        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent" />
        )}
      </div>

      {/* Info */}
      {(title || description || year || tag) && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {(tag || year) && (
            <p className="font-mono text-[9px] text-[#404040] mb-1 tracking-widest uppercase">
              {tag}{tag && year && ' · '}{year}
            </p>
          )}
          {title && (
            <h3 className="text-sm font-medium text-[#d0d0d0] group-hover:text-[#f0f0f0] transition-colors leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[11px] text-[#505050] mt-1 leading-relaxed line-clamp-2">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
