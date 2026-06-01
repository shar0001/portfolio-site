'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
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
