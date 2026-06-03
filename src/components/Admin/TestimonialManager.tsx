'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data testimoni
interface Testimonial {
  id: number
  nama: string
  kota: string | null
  bintang: number
  teks: string
  created_at: string
}

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    kota: '',
    bintang: '5',
    teks: '',
  })

  // Gunakan ref untuk mencegah multiple fetch
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
      
      if (isMounted.current) {
        setTestimonials(data || [])
      }
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

  const handleEdit = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('testimoni')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw error
      
      if (!data) {
        alert('Testimoni tidak ditemukan!')
        return
      }
      
      setEditingTestimonial(data)
      setFormData({
        nama: data.nama || '',
        kota: data.kota || '',
        bintang: data.bintang?.toString() || '5',
        teks: data.teks || '',
      })
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading testimonial:', error)
      if (error instanceof Error) {
        alert('Gagal load data testimoni: ' + error.message)
      } else {
        alert('Gagal load data testimoni: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return
    
    try {
      const { error } = await supabase
        .from('testimoni')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Testimoni berhasil dihapus!')
      loadTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      if (error instanceof Error) {
        alert('Gagal menghapus testimoni: ' + error.message)
      } else {
        alert('Gagal menghapus testimoni: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        nama: formData.nama,
        kota: formData.kota || null,
        bintang: parseInt(formData.bintang),
        teks: formData.teks,
      }

      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimoni')
          .update(data)
          .eq('id', editingTestimonial.id)
        
        if (error) throw error
        alert('Testimoni berhasil diupdate!')
      } else {
        const { error } = await supabase
          .from('testimoni')
          .insert([data])
        
        if (error) throw error
        alert('Testimoni berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setEditingTestimonial(null)
      loadTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      if (error instanceof Error) {
        alert('Gagal menyimpan testimoni: ' + error.message)
      } else {
        alert('Gagal menyimpan testimoni: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-star"></i> Manajemen Testimoni</h2>
        <button className="btn-primary" onClick={() => {
          setEditingTestimonial(null)
          setFormData({
            nama: '',
            kota: '',
            bintang: '5',
            teks: '',
          })
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
            {testimonials.map((t: Testimonial) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td><strong>{t.nama}</strong></td>
                <td>{t.kota || '-'}</td>
                <td>{'⭐'.repeat(t.bintang)}</td>
                <td>{t.teks?.substring(0, 50)}...</td>
                <td>
                  <button 
                    className="btn-small" 
                    onClick={() => handleEdit(t.id)}
                    style={{ marginRight: '5px' }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-small btn-danger" 
                    onClick={() => handleDelete(t.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kota</label>
                  <input
                    type="text"
                    value={formData.kota}
                    onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Bintang</label>
                  <select
                    value={formData.bintang}
                    onChange={(e) => setFormData({ ...formData, bintang: e.target.value })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Testimoni</label>
                  <textarea
                    value={formData.teks}
                    onChange={(e) => setFormData({ ...formData, teks: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-full">Simpan</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}