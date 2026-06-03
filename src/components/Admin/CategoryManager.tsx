'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Category {
  id: number
  nama: string
  jumlah_produk: number
  created_at: string
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
  })

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadCategories = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) throw error
      
      if (isMounted.current) {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadCategories()
    
    return () => {
      isMounted.current = false
    }
  }, [loadCategories])

  const handleEdit = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw error
      
      if (!data) {
        alert('Kategori tidak ditemukan!')
        return
      }
      
      setEditingCategory(data)
      setFormData({
        nama: data.nama || '',
      })
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading category:', error)
      // ✅ Type guard untuk error
      if (error instanceof Error) {
        alert('Gagal load data kategori: ' + error.message)
      } else {
        alert('Gagal load data kategori: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return
    
    try {
      const { error } = await supabase
        .from('kategori')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Kategori berhasil dihapus!')
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      // ✅ Type guard untuk error
      if (error instanceof Error) {
        alert('Gagal menghapus kategori: ' + error.message)
      } else {
        alert('Gagal menghapus kategori: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        nama: formData.nama,
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('kategori')
          .update(data)
          .eq('id', editingCategory.id)
        
        if (error) throw error
        alert('Kategori berhasil diupdate!')
      } else {
        const { error } = await supabase
          .from('kategori')
          .insert([data])
        
        if (error) throw error
        alert('Kategori berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setEditingCategory(null)
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      // ✅ Type guard untuk error
      if (error instanceof Error) {
        alert('Gagal menyimpan kategori: ' + error.message)
      } else {
        alert('Gagal menyimpan kategori: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-tags"></i> Manajemen Kategori</h2>
        <button className="btn-primary" onClick={() => {
          setEditingCategory(null)
          setFormData({
            nama: '',
          })
          setIsModalOpen(true)
        }}>
          <i className="fas fa-plus"></i> Tambah Kategori
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Jumlah Produk</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((k: Category) => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td><strong>{k.nama}</strong></td>
                <td>{k.jumlah_produk || 0}</td>
                <td>
                  <button 
                    className="btn-small" 
                    onClick={() => handleEdit(k.id)}
                    style={{ marginRight: '5px' }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-small btn-danger" 
                    onClick={() => handleDelete(k.id)}
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
              <h3>{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Kategori</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
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