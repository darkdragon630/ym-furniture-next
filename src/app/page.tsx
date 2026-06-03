'use client'

import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Products from '@/components/Products'
import Promo from '@/components/Promo'
import Testimonials from '@/components/Testimonials'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import CartModal from '@/components/CartModal'
import CheckoutModal from '@/components/CheckoutModal'
import Toast from '@/components/Toast'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { cart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    // Load cart from localStorage sudah otomatis di context
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <Promo />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <CartModal />
      <CheckoutModal />
      <Toast />
      <WhatsAppFloat />
    </>
  )
}