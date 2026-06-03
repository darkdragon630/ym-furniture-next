'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ToastContextType {
  message: string
  isVisible: boolean
  showToast: (msg: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const showToast = (msg: string) => {
    setMessage(msg)
    setIsVisible(true)
    setTimeout(() => {
      setIsVisible(false)
    }, 2800)
  }

  // Dengar custom event dari komponen lain (seperti Promo)
  useEffect(() => {
    const handleShowToast = (e: CustomEvent) => {
      showToast(e.detail.message)
    }
    
    document.addEventListener('showToast', handleShowToast as EventListener)
    
    return () => {
      document.removeEventListener('showToast', handleShowToast as EventListener)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ message, isVisible, showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}