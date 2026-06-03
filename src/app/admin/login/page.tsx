'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !admin) {
        setError('Email atau password salah!')
        setLoading(false)
        return
      }

      // Verifikasi password (base64 decode)
      if (atob(admin.password) !== password) {
        setError('Email atau password salah!')
        setLoading(false)
        return
      }

      // Generate SID
      const sid = 'SID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const loginTime = new Date().toISOString()

      // Update SID di database
      await supabase
        .from('admin')
        .update({ sid, last_login: loginTime })
        .eq('id', admin.id)

      // Simpan session di sessionStorage
      sessionStorage.setItem('ym_sid', sid)
      sessionStorage.setItem('ym_email', email)
      sessionStorage.setItem('ym_nama', admin.nama_lengkap)
      sessionStorage.setItem('ym_login_time', loginTime)

      // Simpan juga di cookie untuk middleware
      document.cookie = `ym_sid=${sid}; path=/; max-age=86400`
      document.cookie = `ym_email=${email}; path=/; max-age=86400`

      console.log('✅ Login berhasil! SID:', sid)
      console.log('✅ Redirect ke dashboard...')

      // Redirect ke dashboard
      router.push('/admin/dashboard')
      
    } catch (err) {
      console.error('Login error:', err)
      setError('Terjadi kesalahan. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-header">
          <div className="logo-small">YM FURNITUR</div>
          <h2>Login Admin</h2>
          <p>Masuk untuk mengelola sistem toko</p>
        </div>

        {error && (
          <div className="error-msg">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Loading...' : 'Login Admin'}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun? <Link href="/admin/register">Daftar Admin</Link>
        </div>
      </div>
    </div>
  )
}