'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data produk dan kategori
interface Category {
  id: number
  nama: string
  jumlah_produk: number
  created_at: string
}

interface Product {
  id: number
  nama: string
  harga: number
  diskon: number
  kategori_id: number | null
  kategori?: Category
  deskripsi: string | null
  gambar: string | null
  baru: boolean
  created_at: string
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    kategori_id: '',
    harga: '',
    diskon: '0',
    deskripsi: '',
    gambar: '',
    baru: false,
  })

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadProducts = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('produk')
        .select('*, kategori(*)')
        .order('id', { ascending: false })
      
      if (error) throw error
      
      if (isMounted.current) {
        setProducts(data || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

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
    loadProducts()
    loadCategories()
    
    return () => {
      isMounted.current = false
    }
  }, [loadProducts, loadCategories])

  const handleEdit = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('produk')
        .select('*, kategori(*)')
        .eq('id', id)
        .maybeSingle()
      
      if (error) throw error
      
      if (!data) {
        alert('Produk tidak ditemukan!')
        return
      }
      
      setEditingProduct(data)
      setFormData({
        nama: data.nama || '',
        kategori_id: data.kategori_id?.toString() || '',
        harga: data.harga?.toString() || '',
        diskon: data.diskon?.toString() || '0',
        deskripsi: data.deskripsi || '',
        gambar: data.gambar || '',
        baru: data.baru || false,
      })
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error loading product:', error)
      if (error instanceof Error) {
        alert('Gagal load data produk: ' + error.message)
      } else {
        alert('Gagal load data produk: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return
    
    try {
      const { error } = await supabase
        .from('produk')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Produk berhasil dihapus!')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      if (error instanceof Error) {
        alert('Gagal menghapus produk: ' + error.message)
      } else {
        alert('Gagal menghapus produk: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const kategoriId = formData.kategori_id ? parseInt(formData.kategori_id) : null
      
      const data = {
        nama: formData.nama,
        kategori_id: kategoriId,
        harga: parseInt(formData.harga) || 0,
        diskon: parseInt(formData.diskon) || 0,
        deskripsi: formData.deskripsi || '',
        gambar: formData.gambar || '',
        baru: formData.baru,
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('produk')
          .update(data)
          .eq('id', editingProduct.id)
        
        if (error) throw error
        alert('Produk berhasil diupdate!')
      } else {
        const { error } = await supabase
          .from('produk')
          .insert([data])
        
        if (error) throw error
        alert('Produk berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setEditingProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      if (error instanceof Error) {
        alert('Gagal menyimpan produk: ' + error.message)
      } else {
        alert('Gagal menyimpan produk: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-box"></i> Manajemen Produk</h2>
        <button className="btn-primary" onClick={() => {
          setEditingProduct(null)
          setFormData({
            nama: '',
            kategori_id: '',
            harga: '',
            diskon: '0',
            deskripsi: '',
            gambar: '',
            baru: false,
          })
          setIsModalOpen(true)
        }}>
          <i className="fas fa-plus"></i> Tambah Produk
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Diskon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: Product) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.gambar && (
                    <img 
                      src={p.gambar} 
                      alt={p.nama}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  )}
                </td>
                <td><strong>{p.nama}</strong></td>
                <td>{p.kategori?.nama || '-'}</td>
                <td>Rp {p.harga?.toLocaleString() || 0}</td>
                <td>{p.diskon > 0 ? `${p.diskon}%` : '-'}</td>
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
              <h3>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Harga</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Diskon (%)</label>
                  <input
                    type="number"
                    value={formData.diskon}
                    onChange={(e) => setFormData({ ...formData, diskon: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gambar (URL)</label>
                  <input
                    type="text"
                    value={formData.gambar}
                    onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.baru}
                      onChange={(e) => setFormData({ ...formData, baru: e.target.checked })}
                    />
                    Produk Baru
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