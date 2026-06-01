'use client'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // /studio renders its own reveal animations and relies on position:fixed
  // overlays (custom cursor, prism preview, atmosphere). A transform/filter
  // wrapper here would become their containing block and break fixed
  // positioning, so skip it for studio. The dark site keeps its transition.
  if (pathname.startsWith('/studio')) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}
