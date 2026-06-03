'use client'

import { useState, useEffect } from 'react'

// Data galeri dari index.html
const galeriData = [
  "https://i.ibb.co.com/BHqVmDMt/download.jpg",
  "https://i.ibb.co.com/35bRqKfp/download.jpg",
  "https://i.ibb.co.com/QjHy80X4/download.jpg",
  "https://i.ibb.co.com/Xx8d8fmQ/download.jpg",
  "https://i.ibb.co.com/fVwF5Yj8/download.jpg",
  "https://i.ibb.co.com/xtGFVyGH/download.jpg",
  "https://i.ibb.co.com/Y7xw4DPf/download.jpg",
  "https://i.ibb.co.com/Y73nsryF/download.jpg",
  "https://i.ibb.co.com/5hcMPMnx/download.jpg",
  "https://i.ibb.co.com/39cMJK7c/download.jpg",
  "https://i.ibb.co.com/9H7tdRY9/download.jpg",
  "https://i.ibb.co.com/xtyhnk3H/download.jpg"
]

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  // Hitung total halaman
  const totalPages = Math.ceil(galeriData.length / itemsPerPage)

  // Ambil data untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = galeriData.slice(startIndex, endIndex)

  return (
    <section id="galeri">
      <p className="section-label">Workshop Kami</p>
      <h2 className="section-title">Galeri Produksi</h2>
      <p className="section-sub">
        Setiap detail dikerjakan dengan penuh dedikasi oleh pengrajin berpengalaman kami.
      </p>

      <div className="galeri-grid" id="galeriGrid">
        {currentItems.map((img, index) => (
          <div key={index} className="galeri-item" style={{ padding: 0, background: 'none' }}>
            <img 
              src={img} 
              alt={`Galeri ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
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