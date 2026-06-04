'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Testimonial {
  id: number
  nama: string
  kota: string | null
  bintang: number
  teks: string
  created_at: string
}

const EMPTY_FORM = {
  nama: '',
  kota: '',
  bintang: '5',
  teks: '',
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadTestimonials = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true

    try {
      const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error
      if (isMounted.current) setTestimonials(data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadTestimonials()
    return () => {
      isMounted.current = false
    }
  }, [loadTestimonials])

  // ✅ FIX: Ambil dari state lokal, tidak fetch ulang ke DB
  const handleEdit = (id: number) => {
    const testimonial = testimonials.find(t => t.id === id)
    if (!testimonial) {
      alert('Testimoni tidak ditemukan!')
      return
    }

    setEditingTestimonial(testimonial)
    setFormData({
      nama: testimonial.nama || '',
      kota: testimonial.kota || '',
      bintang: testimonial.bintang?.toString() || '5',
      teks: testimonial.teks || '',
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTestimonial(null)
    setFormData(EMPTY_FORM)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return

    try {
      const { error } = await supabase
        .from('testimoni')
        .delete()
        .eq('id', id)

      if (error) throw error

      // ✅ FIX: Update state lokal langsung, tidak re-fetch
      if (isMounted.current) {
        setTestimonials(prev => prev.filter(t => t.id !== id))
      }
      alert('Testimoni berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      alert('Gagal menghapus testimoni: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ FIX: Guard double submit
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const payload = {
        nama: formData.nama.trim(),
        kota: formData.kota.trim() || null,
        bintang: parseInt(formData.bintang),
        teks: formData.teks.trim(),
      }

      if (editingTestimonial) {
        const { data, error } = await supabase
          .from('testimoni')
          .update(payload)
          .eq('id', editingTestimonial.id)
          .select()
          .single()

        if (error) throw error

        // ✅ FIX: Update state lokal langsung
        if (isMounted.current && data) {
          setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? data : t))
        }
        alert('Testimoni berhasil diupdate!')
      } else {
        const { data, error } = await supabase
          .from('testimoni')
          .insert([payload])
          .select()
          .single()

        if (error) throw error

        // ✅ FIX: Tambah ke state lokal langsung
        if (isMounted.current && data) {
          setTestimonials(prev => [data, ...prev])
        }
        alert('Testimoni berhasil ditambahkan!')
      }

      handleCloseModal()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      alert('Gagal menyimpan testimoni: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = <K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-star"></i> Manajemen Testimoni</h2>
        <button className="btn-primary" onClick={() => {
          setEditingTestimonial(null)
          setFormData(EMPTY_FORM)
          setIsModalOpen(true)
        }}>
          <i className="fas fa-plus"></i> Tambah Testimoni
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama</th>
              <th>Kota</th>
              <th>Bintang</th>
              <th>Testimoni</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  Belum ada testimoni
                </td>
              </tr>
            ) : (
              testimonials.map((t: Testimonial) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td><strong>{t.nama}</strong></td>
                  <td>{t.kota || '-'}</td>
                  <td>{'⭐'.repeat(Math.min(t.bintang, 5))}</td>
                  {/* ✅ FIX: Guard jika teks pendek agar tidak crash */}
                  <td>{t.teks?.length > 50 ? t.teks.substring(0, 50) + '...' : t.teks}</td>
                  <td>
                    <button
                      className="btn-small"
                      onClick={() => handleEdit(t.id)}
                      style={{ marginRight: '5px' }}
                      title="Edit testimoni"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(t.id)}
                      title="Hapus testimoni"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay open" onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseModal()
        }}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => updateField('nama', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => updateField('kota', e.target.value)}
                    placeholder="Opsional"
                  />
                </div>
                <div className="form-group">
                  <label>Bintang</label>
                  <select
                    value={formData.bintang}
                    onChange={(e) => updateField('bintang', e.target.value)}
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Isi Testimoni</label>
                  <textarea
                    value={formData.teks}
                    onChange={(e) => updateField('teks', e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary btn-full"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
