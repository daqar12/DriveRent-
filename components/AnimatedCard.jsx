// components/AnimatedCard.jsx
'use client'
import { useState } from 'react'

export function AnimatedCard({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-300 ${className} ${
        isHovered 
          ? 'transform hover:-translate-y-2 hover:shadow-2xl' 
          : 'hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

// components/FadeIn.jsx
'use client'
import { useEffect, useState } from 'react'

export function FadeIn({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  )
}

// components/ScaleIn.jsx
'use client'
import { useEffect, useState } from 'react'

export function ScaleIn({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-300 transform ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}