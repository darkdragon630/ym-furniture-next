'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export default function ProductImage({ src, alt, className, width = 200, height = 200 }: ProductImageProps) {
  const [error, setError] = useState(false)
  
  if (!src || error) {
    return (
      <div className={className} style={{ 
        width, 
        height, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f5efe0'
      }}>
        <span style={{ fontSize: '3rem' }}>🪑</span>
      </div>
    )
  }
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
      style={{ objectFit: 'cover' }}
    />
  )
}