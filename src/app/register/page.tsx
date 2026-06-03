'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, loginWithGoogle } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!nama) {
      setError('Nama lengkap harus diisi!')
      setLoading(false)
      return
    }

    if (!email || !email.includes('@')) {
      setError('Email tidak valid!')
      setLoading(false)
      return
    }

    if (!phone) {
      setError('Nomor telepon harus diisi!')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter!')
      setLoading(false)
      return
    }

    if (password !== confirm) {
      setError('Password dan konfirmasi tidak cocok!')
      setLoading(false)
      return
    }

    const { error } = await register(email, password, {
      nama_lengkap: nama,
      phone: phone,
      role: 'user',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.')
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  const handleGoogleRegister = async () => {
    await loginWithGoogle()
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-small">YM FURNITUR</div>
          <h2>Daftar Pelanggan</h2>
          <p>Buat akun untuk berbelanja dan mendapatkan promo</p>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        {success && (
          <div className="success-msg">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama Anda"
              required
            />
          </div>
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
            <label>Nomor HP</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              required
            />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <div className="divider">atau</div>

        <button className="btn-google" onClick={handleGoogleRegister}>
          <i className="fab fa-google"></i> Daftar dengan Google
        </button>

        <div className="auth-footer">
          Sudah punya akun? <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}