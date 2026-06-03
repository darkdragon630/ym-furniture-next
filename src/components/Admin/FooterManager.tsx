'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface FooterData {
  teks: string
  instagram: string
}

export default function FooterManager() {
  const [footerText, setFooterText] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [loading, setLoading] = useState(false)

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadFooter = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('pengaturan')
        .select('*')
        .eq('key', 'footer')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data && isMounted.current) {
        const value = data.value as FooterData
        setFooterText(value?.teks || '')
        setInstagramLink(value?.instagram || '')
      }
    } catch (error) {
      console.error('Error loading footer:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadFooter()
    
    return () => {
      isMounted.current = false
    }
  }, [loadFooter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('pengaturan')
        .upsert([{
          key: 'footer',
          value: {
            teks: footerText,
            instagram: instagramLink
          }
        }], { onConflict: 'key' })

      if (error) throw error
      alert('Footer berhasil diupdate!')
    } catch (error) {
      console.error('Error updating footer:', error)
      if (error instanceof Error) {
        alert('Gagal update footer: ' + error.message)
      } else {
        alert('Gagal update footer: Terjadi kesalahan yang tidak diketahui')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-edit"></i> Edit Footer</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Teks Footer</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Masukkan teks footer"
          />
        </div>
        <div className="form-group">
          <label>Link Instagram</label>
          <input
            type="text"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  )
}