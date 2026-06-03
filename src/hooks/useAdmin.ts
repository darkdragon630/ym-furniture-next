'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminData, setAdminData] = useState<any>(null)

  const checkAdminSession = () => {
    const sid = sessionStorage.getItem('ym_sid')
    return !!sid
  }

  const adminLogin = async (email: string, password: string) => {
    try {
      const { data: admin, error } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !admin) {
        return { error: 'Email atau password salah!' }
      }

      if (atob(admin.password) !== password) {
        return { error: 'Email atau password salah!' }
      }

      const sid = 'SID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      const loginTime = new Date().toISOString()

      await supabase
        .from('admin')
        .update({ sid, last_login: loginTime })
        .eq('id', admin.id)

      // Simpan di sessionStorage
      sessionStorage.setItem('ym_sid', sid)
      sessionStorage.setItem('ym_email', email)
      sessionStorage.setItem('ym_nama', admin.nama_lengkap)
      sessionStorage.setItem('ym_login_time', loginTime)

      // Simpan di cookie untuk middleware
      document.cookie = `ym_sid=${sid}; path=/; max-age=86400; SameSite=Lax`

      return { success: true, admin }
    } catch (err) {
      return { error: 'Terjadi kesalahan. Silakan coba lagi.' }
    }
  }

  const adminRegister = async (nama: string, email: string, password: string) => {
    try {
      const { data: existingAdmin } = await supabase
        .from('admin')
        .select('email')
        .eq('email', email)
        .single()

      if (existingAdmin) {
        return { error: 'Email admin sudah terdaftar!' }
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
        return { error: 'Gagal mendaftar: ' + error.message }
      }

      return { success: true }
    } catch (err) {
      return { error: 'Terjadi kesalahan. Silakan coba lagi.' }
    }
  }

  const adminLogout = () => {
    sessionStorage.clear()
    document.cookie = 'ym_sid=; path=/; max-age=0'
  }

  return {
    isAdmin,
    adminData,
    checkAdminSession,
    adminLogin,
    adminRegister,
    adminLogout,
  }
}