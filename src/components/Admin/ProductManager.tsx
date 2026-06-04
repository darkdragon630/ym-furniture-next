'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

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

const EMPTY_FORM = {
  nama: '',
  kategori_id: '',
  harga: '',
  diskon: '0',
  deskripsi: '',
  gambar: '',
  baru: false,
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isMounted = useRef(true)

  // ✅ FIX: Pisahkan ref per fungsi, bukan shared
  const isFetchingProducts = useRef(false)
  const isFetchingCategories = useRef(false)

  // ✅ FIX: loadProducts pakai ref sendiri
  const loadProducts = useCallback(async () => {
    if (isFetchingProducts.current) return
    isFetchingProducts.current = true

    try {
      const { data, error } = await supabase
        .from('produk')
        .select('*, kategori(*)')
        .order('id', { ascending: false })

      if (error) throw error
      if (isMounted.current) setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      isFetchingProducts.current = false
    }
  }, [])

  // ✅ FIX: loadCategories pakai ref sendiri, tidak bentrok
  const loadCategories = useCallback(async () => {
    if (isFetchingCategories.current) return
    isFetchingCategories.current = true

    try {
      const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('nama', { ascending: true })

      if (error) throw error
      if (isMounted.current) setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      isFetchingCategories.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true

    // ✅ Jalankan keduanya parallel, tidak saling blokir
    Promise.all([loadProducts(), loadCategories()])

    return () => {
      isMounted.current = false
    }
  }, [loadProducts, loadCategories])

  // ✅ FIX: handleEdit ambil dari state lokal, tidak fetch ulang ke DB
  const handleEdit = (id: number) => {
    const product = products.find(p => p.id === id)
    if (!product) {
      alert('Produk tidak ditemukan!')
      return
    }

    setEditingProduct(product)
    setFormData({
      nama: product.nama || '',
      kategori_id: product.kategori_id?.toString() || '',
      harga: product.harga?.toString() || '',
      diskon: product.diskon?.toString() || '0',
      deskripsi: product.deskripsi || '',
      gambar: product.gambar || '',
      baru: product.baru || false,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData(EMPTY_FORM)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return

    try {
      const { error } = await supabase
        .from('produk')
        .delete()
        .eq('id', id)

      if (error) throw error

      // ✅ FIX: Update state lokal langsung, tidak fetch ulang
      if (isMounted.current) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
      alert('Produk berhasil dihapus!')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Gagal menghapus produk: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
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
        kategori_id: formData.kategori_id ? parseInt(formData.kategori_id) : null,
        harga: parseInt(formData.harga) || 0,
        diskon: parseInt(formData.diskon) || 0,
        deskripsi: formData.deskripsi.trim() || '',
        gambar: formData.gambar.trim() || '',
        baru: formData.baru,
      }

      if (editingProduct) {
        const { data, error } = await supabase
          .from('produk')
          .update(payload)
          .eq('id', editingProduct.id)
          .select('*, kategori(*)')
          .single()

        if (error) throw error

        // ✅ FIX: Update state lokal langsung tanpa re-fetch
        if (isMounted.current && data) {
          setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p))
        }
        alert('Produk berhasil diupdate!')
      } else {
        const { data, error } = await supabase
          .from('produk')
          .insert([payload])
          .select('*, kategori(*)')
          .single()

        if (error) throw error

        // ✅ FIX: Tambahkan ke state lokal tanpa re-fetch
        if (isMounted.current && data) {
          setProducts(prev => [data, ...prev])
        }
        alert('Produk berhasil ditambahkan!')
      }

      handleCloseModal()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Gagal menyimpan produk: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
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
        <h2><i className="fas fa-box"></i> Manajemen Produk</h2>
        <button className="btn-primary" onClick={() => {
          setEditingProduct(null)
          setFormData(EMPTY_FORM)
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
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  Belum ada produk
                </td>
              </tr>
            ) : (
              products.map((p: Product) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.gambar ? (
                      <img
                        src={p.gambar}
                        alt={p.nama}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <span style={{ color: '#ccc' }}>—</span>
                    )}
                  </td>
                  <td><strong>{p.nama}</strong></td>
                  <td>{p.kategori?.nama || '-'}</td>
                  <td>Rp {p.harga?.toLocaleString('id-ID') || 0}</td>
                  <td>{p.diskon > 0 ? `${p.diskon}%` : '-'}</td>
                  <td>
                    <button
                      className="btn-small"
                      onClick={() => handleEdit(p.id)}
                      style={{ marginRight: '5px' }}
                      title="Edit produk"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(p.id)}
                      title="Hapus produk"
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay open" onClick={(e) => {
          // ✅ Klik di luar modal = tutup
          if (e.target === e.currentTarget) handleCloseModal()
        }}>
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Produk' : 'Tambah Produk'}</h3>
              <button className="btn-close" onClick={handleCloseModal}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => updateField('nama', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={formData.kategori_id}
                    onChange={(e) => updateField('kategori_id', e.target.value)}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((c: Category) => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Harga (Rp)</label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) => updateField('harga', e.target.value)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Diskon (%)</label>
                  <input
                    type="number"
                    value={formData.diskon}
                    onChange={(e) => updateField('diskon', e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={formData.deskripsi}
                    onChange={(e) => updateField('deskripsi', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Gambar (URL)</label>
                  <input
                    type="url"
                    value={formData.gambar}
                    onChange={(e) => updateField('gambar', e.target.value)}
                    placeholder="https://example.com/gambar.jpg"
                  />
                  {/* ✅ Preview gambar real-time */}
                  {formData.gambar && (
                    <img
                      src={formData.gambar}
                      alt="Preview"
                      style={{ marginTop: '8px', width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  )}
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.baru}
                      onChange={(e) => updateField('baru', e.target.checked)}
                    />
                    Tandai sebagai Produk Baru
                  </label>
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
