'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CheckoutModal() {
  const router = useRouter()
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [ekspedisi, setEkspedisi] = useState('')
  const [catatan, setCatatan] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const {
    cart,
    totalPrice,
    promoDiscount,
    closeCart,
  } = useCart()

  // Dengar event dari CartModal untuk membuka modal
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    document.addEventListener('openCheckout', handleOpen)
    return () => document.removeEventListener('openCheckout', handleOpen)
  }, [])

  // Modal terbuka jika isOpen true atau jika user klik closeCart
  if (!isOpen) return null

  const subtotal = cart.reduce((sum, item) => {
    const price = item.diskon > 0 
      ? Math.round(item.harga * (1 - item.diskon / 100)) 
      : item.harga
    return sum + price * item.qty
  }, 0)

  const potongan = Math.round(subtotal * promoDiscount / 100)
  const total = subtotal - potongan

  const handleClose = () => {
    setIsOpen(false)
    closeCart()
  }

  const handleKirimWA = () => {
    // Validasi
    if (!nama.trim()) {
      alert('⚠️ Nama lengkap harus diisi!')
      return
    }
    if (!hp.trim()) {
      alert('⚠️ Nomor HP harus diisi!')
      return
    }
    if (!alamat.trim()) {
      alert('⚠️ Alamat harus diisi!')
      return
    }
    if (!ekspedisi) {
      alert('⚠️ Pilih ekspedisi terlebih dahulu!')
      return
    }

    const itemsList = cart.map(item => 
      `• ${item.nama} ×${item.qty} = Rp ${((item.diskon > 0 ? Math.round(item.harga * (1 - item.diskon / 100)) : item.harga) * item.qty).toLocaleString()}`
    ).join('\n')

    const msg = `Halo YM FURNITUR 👋

Saya ingin memesan mebel:

📦 *PESANAN:*
${itemsList}
${promoDiscount > 0 ? `\n💸 Kode Promo: -${promoDiscount}% (-Rp ${potongan.toLocaleString()})` : ''}
💰 *Total: Rp ${total.toLocaleString()}*

📋 *DATA PEMESAN:*
Nama: ${nama}
No. HP: ${hp}
Alamat: ${alamat}
Ekspedisi: ${ekspedisi}
Pembayaran: DANA 088980723930
${catatan ? 'Catatan: ' + catatan : ''}

Terima kasih 🙏`

    // Buka WhatsApp
    window.open('https://wa.me/6288980723930?text=' + encodeURIComponent(msg), '_blank')
    
    // Tutup modal dan reset cart
    handleClose()
  }

  return (
    <div className="modal-overlay open" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📦 Form Pemesanan</h3>
          <button className="btn-close" onClick={handleClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Dashboard Ringkasan */}
          <div style={{ background: 'linear-gradient(135deg,#1A1209,#3D2008)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <p style={{ color: '#C49A35', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>✦ Ringkasan Pesanan</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(196,154,53,0.12)', border: '1px solid rgba(196,154,53,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display,serif', color: '#C49A35' }}>{cart.length}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Item</div>
              </div>
              <div style={{ background: 'rgba(196,154,53,0.12)', border: '1px solid rgba(196,154,53,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#C49A35' }}>Rp {subtotal.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Subtotal</div>
              </div>
              <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4ade80' }}>Rp {total.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Total Bayar</div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nama Lengkap *</label>
              <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Budi Santoso" />
            </div>
            <div className="form-group">
              <label>Nomor HP / WhatsApp *</label>
              <input type="tel" value={hp} onChange={(e) => setHp(e.target.value)} placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          <div className="form-group">
            <label>Alamat Lengkap *</label>
            <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"></textarea>
          </div>
          <div className="form-group">
            <label>Pilih Ekspedisi *</label>
            <select value={ekspedisi} onChange={(e) => setEkspedisi(e.target.value)}>
              <option value="">— Pilih Ekspedisi —</option>
              <option value="JNE">JNE</option>
              <option value="J&T Express">J&T Express</option>
              <option value="Cargo Khusus Mebel">Cargo Khusus Mebel (Direkomendasikan)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Catatan Pesanan</label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Warna finishing, ukuran custom, instruksi khusus, dll..."></textarea>
          </div>

          <button className="btn-checkout-wa" onClick={handleKirimWA}>
            💬 Kirim Pesanan via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}