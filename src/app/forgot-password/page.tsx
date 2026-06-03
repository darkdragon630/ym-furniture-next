'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!email || !email.includes('@')) {
      setError('Masukkan email yang valid!')
      setLoading(false)
      return
    }

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(`Link reset password telah dikirim ke ${email}`)
    setTimeout(() => {
      window.location.href = '/login'
    }, 3000)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-small">YM FURNITUR</div>
          <h2>Lupa Password</h2>
          <p>Masukkan email Anda untuk mereset password</p>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {success && (
          <div className="success-msg">{success}</div>
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
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Loading...' : 'Kirim Link Reset'}
          </button>
        </form>

        <div className="auth-footer">
          <Link href="/login">
            <i className="fas fa-arrow-left"></i> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  )
}