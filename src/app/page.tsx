'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

const images = [
  '/image1.jpg',
  '/image2.jpg',
  '/image3.jpg',
  '/image4.jpg',
  '/image5.jpg',
  '/image6.jpg',
  '/image7.jpg',
  '/image8.jpg',
  '/image9.jpg',
]

export default function FloatingGallery() {
  const [interactionPosition, setInteractionPosition] = useState({ x: 0, y: 0 })
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const position = 'touches' in e
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
      setInteractionPosition(position)
    }

    window.addEventListener('mousemove', handleInteraction)
    window.addEventListener('touchmove', handleInteraction)

    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchmove', handleInteraction)
    }
  }, [])

  const handleImageClick = (src: string) => {
    setSelectedImage(src)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-4 sm:p-8 overflow-hidden">
      <div className="relative w-full h-[calc(100vh-6rem)] sm:h-[calc(100vh-8rem)]">
        {images.map((src, index) => (
          <FloatingImage
            key={index}
            src={src}
            interactionPosition={interactionPosition}
            index={index}
            onClick={() => handleImageClick(src)}
          />
        ))}
      </div>
      <AnimatePresence>
        {selectedImage && (
          <EnlargedImage src={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

interface FloatingImageProps {
  src: string
  interactionPosition: { x: number; y: number }
  index: number
  onClick: () => void
}

function FloatingImage({ src, interactionPosition, index, onClick }: FloatingImageProps) {
  const controls = useAnimation()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const randomPosition = () => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth * 0.8 : 0),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 0.8 : 0),
    })

    setPosition(randomPosition())

    const interval = setInterval(() => {
      const newPosition = randomPosition()
      controls.start({
        x: newPosition.x,
        y: newPosition.y,
        transition: { duration: 20, ease: 'easeInOut' },
      })
    }, 20000)

    return () => clearInterval(interval)
  }, [controls])

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(interactionPosition.x - position.x, 2) + Math.pow(interactionPosition.y - position.y, 2)
    )

    const maxDistance = typeof window !== 'undefined' ? Math.min(300, window.innerWidth / 3) : 300
    const scale = Math.max(0.8, 1.2 - distance / maxDistance)

    controls.start({
      scale,
      transition: { duration: 0.3 },
    })
  }, [interactionPosition, position, controls])

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: position.x, top: position.y }}
      animate={controls}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1 }}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={`Floating image ${index + 1}`}
        width={200}
        height={200}
        className="rounded-full shadow-lg w-16 h-16 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover"
      />
    </motion.div>
  )
}

interface EnlargedImageProps {
  src: string
  onClose: () => void
}

function EnlargedImage({ src, onClose }: EnlargedImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Enlarged image"
          width={800}
          height={800}
          className="max-w-full max-h-[90vh] object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

