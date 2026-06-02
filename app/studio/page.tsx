'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** /studio is no longer the primary URL — redirect to the root. */
export default function StudioRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/') }, [router])
  return null
}
