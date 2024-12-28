'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const [interactionPosition, setInteractionPosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const position = 'touches' in e 
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
      setInteractionPosition(position)
      setIsTouch('touches' in e)
    }

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('touchmove', handleInteraction)

    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchmove', handleInteraction)
    }
  }, [])

  if (isTouch) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white pointer-events-none z-50 mix-blend-difference hidden sm:block"
      animate={{ x: interactionPosition.x - 12, y: interactionPosition.y - 12 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  )
}

