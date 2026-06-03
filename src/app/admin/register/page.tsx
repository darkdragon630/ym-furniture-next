'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminRegisterPage() {
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

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

    const { data: existingAdmin } = await supabase
      .from('admin')
      .select('email')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      setError('Email admin sudah terdaftar!')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('admin')
      .insert([{
        nama_lengkap: nama,
        email: email,
        password: btoa(password),
        role: 'admin',
      }])

    if (error) {
      setError('Gagal mendaftar: ' + error.message)
      setLoading(false)
      return
    }

    setSuccess('Pendaftaran admin berhasil! Silakan login.')
    setTimeout(() => {
      router.push('/admin/login')
    }, 2000)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-small">YM FURNITUR</div>
          <h2>Daftar Admin</h2>
          <p>Buat akun admin untuk mengelola toko</p>
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
              placeholder="Ike Puspitasari"
              required
            />
          </div>
          <div className="form-group">
            <label>Email Admin</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ymfurnitur.com"
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
            {loading ? 'Loading...' : 'Daftar Admin'}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun? <Link href="/admin/login">Login Admin</Link>
        </div>
      </div>
    </div>
  )
}