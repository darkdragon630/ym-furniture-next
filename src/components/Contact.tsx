'use client'

export default function Contact() {
  return (
    <section id="kontak">
      <p className="section-label">Hubungi Kami</p>
      <h2 className="section-title">Ada yang Bisa Kami Bantu?</h2>
      <div className="kontak-grid">
        <div>
          {/* WhatsApp */}
          <div className="kontak-info-item">
            <div className="kontak-icon">📱</div>
            <div>
              <div className="kontak-label">WhatsApp</div>
              <div className="kontak-val">
                <a href="https://wa.me/6288980723930" target="_blank">088980723930</a>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="kontak-info-item">
            <div className="kontak-icon">✉️</div>
            <div>
              <div className="kontak-label">Email</div>
              <div className="kontak-val">
                <a href="mailto:ikepuspitasari404@gmail.com">ikepuspitasari404@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Alamat */}
          <div className="kontak-info-item">
            <div className="kontak-icon">📍</div>
            <div>
              <div className="kontak-label">Alamat Workshop</div>
              <div className="kontak-val">
                RT 4 RW 12, Bangsri Cobaan Sidorejo,<br />
                Jepara, Jawa Tengah
              </div>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="kontak-info-item">
            <div className="kontak-icon">🕐</div>
            <div>
              <div className="kontak-label">Jam Operasional</div>
              <div className="kontak-val">
                Senin – Sabtu: 08.00 – 17.00 WIB<br />
                Minggu: 09.00 – 14.00 WIB
              </div>
            </div>
          </div>

          {/* Tombol Chat WhatsApp */}
          <a 
            href="https://wa.me/6288980723930?text=Halo%20YM%20FURNITUR%2C%20saya%20ingin%20konsultasi%20mebel" 
            target="_blank" 
            className="btn-primary" 
            style={{ marginTop: '1rem', display: 'inline-flex', gap: '8px', alignItems: 'center' }}
          >
            💬 Chat WhatsApp Sekarang
          </a>
        </div>

        {/* Google Maps */}
        <div>
          <div className="map-placeholder">
            <div className="map-icon">🗺️</div>
            <p>RT 4 RW 12, Bangsri Cobaan Sidorejo</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Jepara, Jawa Tengah</p>
            <a 
              href="https://maps.app.goo.gl/ET9uMLrHqnDZXn1B6" 
              target="_blank" 
              style={{ marginTop: '12px', padding: '8px 20px', background: 'var(--coklat)', color: 'var(--cream)', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Buka di Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}