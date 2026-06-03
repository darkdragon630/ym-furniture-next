'use client'

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <span className="logo">
            YM FURNITUR <span>MEBEL JEPARA</span>
          </span>
          <p>
            Menghadirkan keindahan kayu jati asli Jepara ke rumah Anda sejak 1985. Kualitas terjamin, harga terjangkau, pelayanan tulus dari hati.
          </p>
          <div className="socials">
            <a className="social-btn" href="#" title="Instagram">📸</a>
            <a className="social-btn" href="#" title="Facebook">👥</a>
            <a className="social-btn" href="#" title="TikTok">🎵</a>
            <a className="social-btn" href="https://wa.me/6288980723930" title="WhatsApp" target="_blank">💬</a>
          </div>
        </div>

        {/* Navigasi */}
        <div className="footer-col">
          <h4>Navigasi</h4>
          <ul>
            <li><a href="#hero">Beranda</a></li>
            <li><a href="#about">Tentang Kami</a></li>
            <li><a href="#produk">Produk</a></li>
            <li><a href="#promo">Promo</a></li>
            <li><a href="#galeri">Galeri</a></li>
            <li><a href="#kontak">Kontak</a></li>
            <li><a href="/login" style={{ color: 'var(--emas)' }}>🔐 Masuk</a></li>
          </ul>
        </div>

        {/* Kategori */}
        <div className="footer-col">
          <h4>Kategori</h4>
          <ul>
            <li><a href="#produk">Kursi Tamu</a></li>
            <li><a href="#produk">Meja Makan</a></li>
            <li><a href="#produk">Lemari</a></li>
            <li><a href="#produk">Tempat Tidur</a></li>
            <li><a href="#produk">Sofa</a></li>
            <li><a href="#produk">Kitchen Set</a></li>
          </ul>
        </div>

        {/* Layanan */}
        <div className="footer-col">
          <h4>Layanan</h4>
          <ul>
            <li><a href="#">Custom Desain</a></li>
            <li><a href="#">Pengiriman Cargo</a></li>
            <li><a href="#">Konsultasi Gratis</a></li>
            <li><a href="#">Garansi Produk</a></li>
            <li><a href="#">After Sales</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 YM FURNITUR — Mebel Jepara Berkualitas Sejak 1985. Semua hak dilindungi.</p>
        <p>Dibuat dengan ❤️ di Jepara, Jawa Tengah</p>
      </div>
    </footer>
  )
}