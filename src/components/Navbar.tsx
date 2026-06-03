'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount, openCart } = useCart()
  const { user, logout } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const nav = document.querySelector('nav')
      const hamburger = document.querySelector('.hamburger')
      if (isMenuOpen && nav && !nav.contains(e.target as Node) && !hamburger?.contains(e.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        YM FURNITUR
        <span>MEBEL JEPARA</span>
      </div>
      
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><a href="#hero" onClick={() => setIsMenuOpen(false)}>Beranda</a></li>
        <li><a href="#about" onClick={() => setIsMenuOpen(false)}>Tentang</a></li>
        <li><a href="#produk" onClick={() => setIsMenuOpen(false)}>Produk</a></li>
        <li><a href="#promo" onClick={() => setIsMenuOpen(false)}>Promo</a></li>
        <li><a href="#testimoni" onClick={() => setIsMenuOpen(false)}>Testimoni</a></li>
        <li><a href="#kontak" onClick={() => setIsMenuOpen(false)}>Kontak</a></li>
        <li className="auth-area">
          {user ? (
            <div className="profile-container">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || user.email || 'User')}`} 
                alt="Profile" 
              />
              <span className="profile-name">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </span>
              <button className="profile-logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              🔐 Masuk
            </Link>
          )}
        </li>
      </ul>
      
      <div className="nav-right">
        <button className="btn-cart" onClick={openCart}>
          🛒 Keranjang
          <span className="cart-badge">{cartCount}</span>
        </button>
        <button className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}