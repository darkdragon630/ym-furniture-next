'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data settings
interface SettingsData {
  email: string
  wa: string
}

export default function SettingsManager() {
  const [notifEmail, setNotifEmail] = useState('on')
  const [notifWA, setNotifWA] = useState('on')
  const [loading, setLoading] = useState(false)

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadSettings = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('pengaturan')
        .select('*')
        .eq('key', 'notifikasi')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data && isMounted.current) {
        const value = data.value as SettingsData
        setNotifEmail(value?.email || 'on')
        setNotifWA(value?.wa || 'on')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadSettings()
    
    return () => {
      isMounted.current = false
    }
  }, [loadSettings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('pengaturan')
        .upsert([{
          key: 'notifikasi',
          value: {
            email: notifEmail,
            wa: notifWA
          }
        }], { onConflict: 'key' })

      if (error) throw error
      alert('Pengaturan berhasil diupdate!')
    } catch (error) {
      console.error('Error updating settings:', error)
      if (error instanceof Error) {
        alert('Gagal update pengaturan: ' + error.message)
      } else {
        alert('Gagal update pengaturan: Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-cog"></i> Pengaturan Notifikasi</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Notifikasi Email</label>
          <select value={notifEmail} onChange={(e) => setNotifEmail(e.target.value)}>
            <option value="on">Aktif</option>
            <option value="off">Nonaktif</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notifikasi WhatsApp</label>
          <select value={notifWA} onChange={(e) => setNotifWA(e.target.value)}>
            <option value="on">Aktif</option>
            <option value="off">Nonaktif</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </form>
    </div>
  )
}