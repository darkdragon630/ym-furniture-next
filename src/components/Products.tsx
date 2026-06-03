'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'

export default function Products() {
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [loading, setLoading] = useState(true)

  const { addToCart } = useCart()

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('produk')
        .select('*, kategori(*)')
        .order('id', { ascending: false })
      
      if (error) throw error
      setProducts(data || [])
      setFilteredProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Filter produk berdasarkan kategori, pencarian, dan sorting
  useEffect(() => {
    let result = products

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.kategori?.nama === selectedCategory)
    }

    // Filter by search
    if (searchTerm) {
      result = result.filter(p => 
        p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.kategori?.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    if (sortBy === 'low') {
      result.sort((a, b) => a.harga - b.harga)
    } else if (sortBy === 'high') {
      result.sort((a, b) => b.harga - a.harga)
    } else if (sortBy === 'diskon') {
      result.sort((a, b) => b.diskon - a.diskon)
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Reset ke halaman pertama saat filter berubah
  }, [selectedCategory, searchTerm, sortBy, products])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const hargaDiskon = (p: any) => {
    return p.diskon > 0 ? Math.round(p.harga * (1 - p.diskon / 100)) : p.harga
  }

  const pesanWA = (p: any) => {
    const msg = `Halo YM FURNITUR 👋\nSaya tertarik dengan:\n\n🪑 *${p.nama}*\nHarga: Rp ${hargaDiskon(p).toLocaleString()}${p.diskon > 0 ? ` (diskon ${p.diskon}%)` : ''}\n\nBoleh info ketersediaan dan detail pengiriman? 🙏`
    window.open(`https://wa.me/6288980723930?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (loading) {
    return (
      <section id="produk">
        <p className="section-label">Koleksi Kami</p>
        <h2 className="section-title">Produk Unggulan</h2>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p>Loading produk...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="produk">
      <p className="section-label">Koleksi Kami</p>
      <h2 className="section-title">Produk Unggulan</h2>

      {/* Search & Filter */}
      <div className="search-wrap">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="price-filter">
          Urutkan:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">— Semua —</option>
            <option value="low">Harga Terendah</option>
            <option value="high">Harga Tertinggi</option>
            <option value="diskon">Diskon Terbesar</option>
          </select>
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Semua
        </button>
        {categories.map((c: any) => (
          <button
            key={c.id}
            className={`filter-btn ${selectedCategory === c.nama ? 'active' : ''}`}
            onClick={() => setSelectedCategory(c.nama)}
          >
            {c.nama}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid" id="productsGrid">
        {currentProducts.length > 0 ? (
          currentProducts.map((p: any) => (
            <div key={p.id} className="product-card">
              <div className="product-img" style={{ padding: 0 }}>
                {p.gambar ? (
                  <img
                    src={p.gambar}
                    alt={p.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '4rem' }}>🪑</span>
                )}
                {p.diskon > 0 && (
                  <span className="badge-diskon">-{p.diskon}%</span>
                )}
                {p.baru && !p.diskon && (
                  <span className="badge-baru">BARU</span>
                )}
              </div>
              <div className="product-info">
                <div className="product-category">{p.kategori?.nama || 'Kategori'}</div>
                <div className="product-name">{p.nama}</div>
                <div className="product-price">
                  <span className="price-now">Rp {hargaDiskon(p).toLocaleString()}</span>
                  {p.diskon > 0 && (
                    <span className="price-old">Rp {p.harga.toLocaleString()}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--abu)', marginBottom: '12px', lineHeight: 1.5 }}>
                  {p.deskripsi}
                </p>
                <div className="product-btns">
                  <button
                    className="btn-wa"
                    onClick={() => pesanWA(p)}
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    className="btn-add-cart"
                    onClick={() => addToCart(p)}
                  >
                    🛒 Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--abu)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
            <p>Produk tidak ditemukan</p>
          </div>
        )}
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