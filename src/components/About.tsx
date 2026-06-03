'use client'

export default function About() {
  return (
    <section id="about">
      <div className="about-grid">
        {/* Bagian Gambar/Video */}
        <div className="about-img-area">
          <div style={{ width: '100%', borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(196,154,53,0.2)', boxShadow: '0 8px 40px rgba(107,63,26,0.15)' }}>
            <video 
              id="aboutVideo" 
              autoPlay 
              muted 
              loop 
              playsInline 
              style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'cover' }}
            >
              <source src="https://stream.mux.com/L8373cixqirr5gkbskrp9niE2AxtxWWzG01C3ytzqo01M.m3u8" type="application/x-mpegURL" />
            </video>
            <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'linear-gradient(transparent,rgba(26,18,9,0.7))', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'pulse 1.5s infinite' }}></div>
              <span style={{ color: '#fff', fontSize: '0.82rem', letterSpacing: '1px' }}>Workshop Aktif · Jepara</span>
            </div>
          </div>
          <div className="about-badge-box">
            <strong>1985</strong>
            <span>Berdiri Sejak</span>
          </div>
        </div>

        {/* Bagian Teks */}
        <div className="about-text">
          <p className="section-label">Tentang Kami</p>
          <h2 className="section-title">Warisan Seni Mebel Jepara</h2>
          <p style={{ color: 'var(--abu)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            YM FURNITUR lahir dari passion seorang pengrajin muda di jantung kota Jepara pada tahun 1985. Berawal dari sebuah bengkel kecil di RT 4 RW 12 Bangsri Cobaan Sidorejo, usaha ini tumbuh menjadi salah satu toko mebel terpercaya yang dikenal luas oleh pelanggan dari berbagai penjuru Indonesia.
          </p>

          <div className="timeline">
            <div className="timeline-item">
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="tl-dot"></div>
                  <span className="tl-year">1985 — Awal Mula</span>
                </div>
                <p className="tl-desc" style={{ paddingLeft: '24px', color: 'var(--abu)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Pendiri YM FURNITUR mulai mengukir kayu jati dengan tangan sendiri di workshop sederhana berukuran 20m². Produk pertama adalah kursi tamu ukiran khas Jepara yang langsung diminati warga sekitar.
                </p>
              </div>
            </div>
            <div className="timeline-item">
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                  <div className="tl-dot"></div>
                  <span className="tl-year">2026 — Hadir Online</span>
                </div>
                <p className="tl-desc" style={{ paddingLeft: '24px', color: 'var(--abu)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Kini YM FURNITUR hadir secara digital agar lebih mudah dijangkau oleh pelanggan dari seluruh Indonesia. Dengan pengalaman lebih dari 40 tahun, kami siap menghadirkan mebel impian langsung ke rumah Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="keunggulan">
            <div className="keunggulan-item">
              <h4>🌳 Kayu Berkualitas</h4>
              <p>Jati & mahoni pilihan grade A</p>
            </div>
            <div className="keunggulan-item">
              <h4>✋ Handmade Jepara</h4>
              <p>Dibuat tangan oleh pengrajin berpengalaman</p>
            </div>
            <div className="keunggulan-item">
              <h4>💰 Harga Terjangkau</h4>
              <p>Langsung dari pengrajin, tanpa perantara</p>
            </div>
            <div className="keunggulan-item">
              <h4>🎨 Custom Desain</h4>
              <p>Sesuaikan ukuran, warna & motif</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}