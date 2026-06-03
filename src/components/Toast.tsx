'use client'

import { useState, useEffect } from 'react'

export default function Toast() {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Dengar event dari komponen lain
    const handleShowToast = (e: CustomEvent) => {
      setMessage(e.detail.message)
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 2800)
    }

    document.addEventListener('showToast', handleShowToast as EventListener)
    
    return () => {
      document.removeEventListener('showToast', handleShowToast as EventListener)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={`toast ${isVisible ? 'show' : ''}`}>
      {message}
    </div>
  )
}