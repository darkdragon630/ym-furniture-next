'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface SettingsData {
  email: string
  wa: string
}

export default function SettingsManager() {
  const [notifEmail, setNotifEmail] = useState('on')
  const [notifWA, setNotifWA] = useState('on')
  const [loading, setLoading] = useState(false)

  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadSettings = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
      // ✅ FIX: Ganti .single() → .maybeSingle()
      // .single()      → error 406 jika 0 baris ditemukan
      // .maybeSingle() → return null jika 0 baris, aman
      const { data, error } = await supabase
        .from('pengaturan')
        .select('*')
        .eq('key', 'notifikasi')
        .maybeSingle()

      if (error) throw error

      if (data && isMounted.current) {
        const value = data.value as SettingsData
        setNotifEmail(value?.email || 'on')
        setNotifWA(value?.wa || 'on')
      }
      // Jika data null → biarkan default state ('on', 'on')
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
    if (loading) return // ✅ Guard double submit
    setLoading(true)

    try {
      const { error } = await supabase
        .from('pengaturan')
        .upsert(
          [{ key: 'notifikasi', value: { email: notifEmail, wa: notifWA } }],
          { onConflict: 'key' }
        )

      if (error) throw error
      alert('Pengaturan berhasil diupdate!')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Gagal update pengaturan: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
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
