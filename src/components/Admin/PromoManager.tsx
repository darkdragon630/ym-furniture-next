'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data promo
interface Promo {
  id: number
  kode: string
  nama: string
  diskon: number
  minimal_pembelian: number
  aktif: boolean
  created_at: string
}

export default function PromoManager() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    diskon: '',
    minimal_pembelian: '0',
    aktif: true,
  })

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadPromos = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('promo')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) throw error
      
      if (isMounted.current) {
        setPromos(data || [])
      }
    } catch (error) {
      console.error('Error loading promos:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadPromos()
    
    return () => {
      isMounted.current = false
    }
  }, [loadPromos])

  const handleEdit = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('promo')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw error
      
      if (!data) {
        alert('Promo tidak ditemukan!')
        return
      }
      
      setEditingPromo(data)
      setFormData({
        kode: data.kode || '',
        nama: data.nama || '',
        diskon: data.diskon?.toString() || '',
        minimal_pembelian: data.minimal_pembelian?.toString() || '0',
        aktif: data.aktif || false,
      })
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading promo:', error)
      if (error instanceof Error) {
        alert('Gagal load data promo: ' + error.message)
      } else {
        alert('Gagal load data promo: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus promo ini?')) return
    
    try {
      const { error } = await supabase
        .from('promo')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Promo berhasil dihapus!')
      loadPromos()
    } catch (error) {
      console.error('Error deleting promo:', error)
      if (error instanceof Error) {
        alert('Gagal menghapus promo: ' + error.message)
      } else {
        alert('Gagal menghapus promo: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        kode: formData.kode.toUpperCase(),
        nama: formData.nama,
        diskon: parseInt(formData.diskon) || 0,
        minimal_pembelian: parseInt(formData.minimal_pembelian) || 0,
        aktif: formData.aktif,
      }

      if (editingPromo) {
        const { error } = await supabase
          .from('promo')
          .update(data)
          .eq('id', editingPromo.id)
        
        if (error) throw error
        alert('Promo berhasil diupdate!')
      } else {
        const { error } = await supabase
          .from('promo')
          .insert([data])
        
        if (error) throw error
        alert('Promo berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setEditingPromo(null)
      loadPromos()
    } catch (error) {
      console.error('Error saving promo:', error)
      if (error instanceof Error) {
        alert('Gagal menyimpan promo: ' + error.message)
      } else {
        alert('Gagal menyimpan promo: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-tags"></i> Manajemen Promo</h2>
        <button className="btn-primary" onClick={() => {
          setEditingPromo(null)
          setFormData({
            kode: '',
            nama: '',
            diskon: '',
            minimal_pembelian: '0',
            aktif: true,
          })
          setIsModalOpen(true)
        }}>
          <i className="fas fa-plus"></i> Tambah Promo
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode</th>
              <th>Nama</th>
              <th>Diskon</th>
              <th>Minimal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p: Promo) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td><strong>{p.kode}</strong></td>
                <td>{p.nama}</td>
                <td>{p.diskon}%</td>
                <td>{p.minimal_pembelian > 0 ? 'Rp ' + p.minimal_pembelian.toLocaleString() : '-'}</td>
                <td>
                  <span className={`badge ${p.aktif ? 'badge-success' : 'badge-danger'}`}>
                    {p.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-small" 
                    onClick={() => handleEdit(p.id)}
                    style={{ marginRight: '5px' }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-small btn-danger" 
                    onClick={() => handleDelete(p.id)}
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
              <h3>{editingPromo ? 'Edit Promo' : 'Tambah Promo'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Kode Promo</label>
                  <input
                    type="text"
                    value={formData.kode}
                    onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                    placeholder="YMFIRST10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama Promo</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Promo Pembelian Pertama"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Diskon (%)</label>
                  <input
                    type="number"
                    value={formData.diskon}
                    onChange={(e) => setFormData({ ...formData, diskon: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimal Pembelian (Rp)</label>
                  <input
                    type="number"
                    value={formData.minimal_pembelian}
                    onChange={(e) => setFormData({ ...formData, minimal_pembelian: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.aktif}
                      onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    />
                    Aktif
                  </label>
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