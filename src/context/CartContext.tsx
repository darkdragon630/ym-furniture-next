'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk CartItem
interface CartItem {
  id: number
  nama: string
  harga: number
  diskon: number
  qty: number
  icon?: string
  gambar?: string
  kategori?: string
  deskripsi?: string
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  addToCart: (product: any) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, delta: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  isCartOpen: boolean
  totalPrice: number
  applyPromo: (code: string) => boolean
  promoDiscount: number
  openCheckout: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoDb, setPromoDb] = useState<Record<string, number>>({})

  // Load cart dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ym_keranjang')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
  }, [])

  // Simpan cart ke localStorage
  useEffect(() => {
    localStorage.setItem('ym_keranjang', JSON.stringify(cart))
  }, [cart])

  // Load promo dari Supabase
  useEffect(() => {
    const loadPromo = async () => {
      const { data, error } = await supabase
        .from('promo')
        .select('*')
        .eq('aktif', true)
      
      if (!error && data) {
        const promoMap: Record<string, number> = {}
        data.forEach((p: any) => {
          promoMap[p.kode] = p.diskon
        })
        setPromoDb(promoMap)
      }
    }
    loadPromo()
  }, [])

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.diskon > 0 
      ? Math.round(item.harga * (1 - item.diskon / 100)) 
      : item.harga
    return sum + price * item.qty
  }, 0)

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => {
      const item = prev.find(item => item.id === id)
      if (!item) return prev
      const newQty = item.qty + delta
      if (newQty <= 0) {
        return prev.filter(item => item.id !== id)
      }
      return prev.map(item => 
        item.id === id 
          ? { ...item, qty: newQty }
          : item
      )
    })
  }

  const clearCart = () => {
    setCart([])
    setPromoDiscount(0)
  }

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const openCheckout = () => {
    setIsCartOpen(false)
    // Trigger event untuk membuka CheckoutModal
    document.dispatchEvent(new CustomEvent('openCheckout'))
  }

  const applyPromo = (code: string) => {
    const upperCode = code.toUpperCase().trim()
    if (promoDb[upperCode]) {
      setPromoDiscount(promoDb[upperCode])
      return true
    }
    setPromoDiscount(0)
    return false
  }

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      isCartOpen,
      totalPrice,
      applyPromo,
      promoDiscount,
      openCheckout,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}