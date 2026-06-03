'use client'

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-content">
        <div className="hero-badge">✦ Mebel Asli Jepara</div>
        <h1>
          Mebel Jepara Berkualitas<br />
          <em>Sejak 1985</em>
        </h1>
        <p>
          Keindahan kayu jati pilihan dipadukan dengan keahlian pengrajin turun-temurun Jepara. 
          Setiap karya adalah warisan, setiap sentuhan adalah seni.
        </p>
        <div className="hero-btns">
          <a href="#produk" className="btn-primary">Lihat Produk</a>
          <a href="https://wa.me/6288980723930?text=Halo%20YM%20FURNITUR%2C%20saya%20ingin%20pesan%20mebel" className="btn-outline" target="_blank">Pesan Sekarang</a>
          <a href="#kontak" className="btn-outline">Hubungi Kami</a>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">38+</div>
            <div className="stat-label">Tahun Pengalaman</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">5.000+</div>
            <div className="stat-label">Produk Terjual</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">500+</div>
            <div className="stat-label">Pelanggan Setia</div>
          </div>
        </div>
      </div>
      
      <div className="hero-img">
        <div className="hero-img-box">
          <img 
            src="https://i.ibb.co.com/BHqVmDMt/download.jpg" 
            alt="Kursi Tamu Ukir Klasik Jepara"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          />
        </div>
      </div>
    </section>
  )
}