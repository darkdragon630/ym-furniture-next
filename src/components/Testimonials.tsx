'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) throw error
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hitung total halaman
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  // Ambil data untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = testimonials.slice(startIndex, endIndex)

  if (loading) {
    return (
      <section id="testimoni">
        <p className="section-label">Kata Mereka</p>
        <h2 className="section-title">Testimoni Pelanggan</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading testimonials...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="testimoni">
      <p className="section-label">Kata Mereka</p>
      <h2 className="section-title">Testimoni Pelanggan</h2>

      <div className="testi-grid" id="testiGrid">
        {currentItems.map((t: any) => (
          <div key={t.id} className="testi-card">
            <div className="testi-stars">{'⭐'.repeat(t.bintang)}</div>
            <p className="testi-text">"{t.teks}"</p>
            <div className="testi-avatar">
              <div className="avatar-circle">
                {t.nama.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="testi-name">{t.nama}</div>
                <div className="testi-loc">📍 {t.kota}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          
          <span className="pagination-info">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>
      )}
    </section>
  )
}