'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Promo() {
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPromos()
  }, [])

  const loadPromos = async () => {
    try {
      const { data, error } = await supabase
        .from('promo')
        .select('*')
        .eq('aktif', true)
        .order('id', { ascending: true })
      
      if (error) throw error
      setPromos(data || [])
    } catch (error) {
      console.error('Error loading promos:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyKode = (kode: string) => {
    navigator.clipboard.writeText(kode).catch(() => {})
    // Trigger toast notification
    const toastEvent = new CustomEvent('showToast', { 
      detail: { message: `📋 Kode "${kode}" disalin! Tempel saat checkout.` }
    })
    document.dispatchEvent(toastEvent)
  }

  if (loading) {
    return (
      <section id="promo">
        <div className="promo-inner">
          <div className="promo-text">
            <p style={{ color: 'var(--emas)', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              ✦ Penawaran Spesial
            </p>
            <h2>Diskon Eksklusif<br />Bulan Ini</h2>
            <p>Memuat data promo...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="promo">
      <div className="promo-inner">
        <div className="promo-text">
          <p style={{ color: 'var(--emas)', fontSize: '0.75rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ✦ Penawaran Spesial
          </p>
          <h2>Diskon Eksklusif<br />Bulan Ini</h2>
          <p>Gunakan kode promo saat checkout.<br />Klik kode untuk menyalin otomatis.</p>
        </div>
        <div className="promo-cards">
          {promos.map((p) => (
            <div key={p.id} className="promo-card">
              <div className="promo-pct">{p.diskon}%</div>
              <div className="promo-desc">{p.nama}</div>
              {p.minimal_pembelian > 0 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--cream)', opacity: 0.7, marginTop: '2px' }}>
                  Min. Rp {p.minimal_pembelian.toLocaleString()}
                </div>
              )}
              <div className="promo-code" onClick={() => copyKode(p.kode)}>
                {p.kode}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}