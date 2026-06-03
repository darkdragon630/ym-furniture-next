'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, loginWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const savedEmail = localStorage.getItem('ym_remember_email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await login(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (rememberMe) {
      localStorage.setItem('ym_remember_email', email)
    } else {
      localStorage.removeItem('ym_remember_email')
    }

    router.push('/')
  }

  const handleGoogleLogin = async () => {
    await loginWithGoogle()
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-small">YM FURNITUR</div>
          <h2>Login Pelanggan</h2>
          <p>Masuk untuk berbelanja dan melihat riwayat pesanan</p>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="form-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Ingat saya
            </label>
            <Link href="/forgot-password" className="forgot-pass">
              Lupa password?
            </Link>
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="divider">atau</div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <i className="fab fa-google"></i> Login dengan Google
        </button>

        <div className="auth-footer">
          Belum punya akun? <Link href="/register">Daftar Sekarang</Link>
        </div>
      </div>
    </div>
  )
}