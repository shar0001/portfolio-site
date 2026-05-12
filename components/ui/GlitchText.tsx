'use client'
import { useEffect, useState, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>[]{}█▓░'

interface Props {
  text: string
  className?: string
  delay?: number
  speed?: number
  tag?: 'span' | 'h1' | 'h2' | 'p'
}

export function GlitchText({ text, className = '', delay = 0, speed = 35, tag: Tag = 'span' }: Props) {
  const [output, setOutput] = useState(text)
  const iter = useRef(0)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      iter.current = 0
      interval.current = setInterval(() => {
        setOutput(
          text.split('').map((char, i) => {
            if (char === ' ' || char === '\n') return char
            if (i < iter.current) return text[i]
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          }).join('')
        )
        iter.current += 0.4
        if (iter.current >= text.length) {
          clearInterval(interval.current!)
          setOutput(text)
        }
      }, speed)
    }, delay)

    return () => {
      clearTimeout(t)
      if (interval.current) clearInterval(interval.current)
    }
  }, [text, delay, speed])

  return <Tag className={`font-mono ${className}`}>{output}</Tag>
}
