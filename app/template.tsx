'use client'
import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* NieR-style scan sweep on page enter */}
      <motion.div
        className="fixed inset-x-0 z-30 pointer-events-none"
        style={{
          height: '3px',
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.65), transparent)',
          boxShadow: '0 0 16px rgba(255,255,255,0.35)',
        }}
        initial={{ top: '0%', opacity: 1 }}
        animate={{ top: '105%', opacity: 0 }}
        transition={{ duration: 0.7, ease: 'linear' }}
      />

      {/* Page content — emerges from the 3D background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05, filter: 'blur(3px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
