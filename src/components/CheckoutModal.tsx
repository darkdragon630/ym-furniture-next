'use client'

import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { supabase } from '@/lib/supabase'

export default function CheckoutModal() {
  const [nama, setNama] = useState('')
  const [hp, setHp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [ekspedisi, setEkspedisi] = useState('')
  const [wilayah, setWilayah] = useState('')
  const [catatan, setCatatan] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [ongkirOptions, setOngkirOptions] = useState<any[]>([])
  const [selectedOngkir, setSelectedOngkir] = useState(0)
  const [loadingOngkir, setLoadingOngkir] = useState(false)

  const isFetchingOngkir = useRef(false)

  const { cart, promoDiscount, closeCart } = useCart()

  const subtotal = cart.reduce((sum, item) => {
    const hargaSatuan = item.diskon > 0
      ? Math.round(item.harga * (1 - item.diskon / 100))
      : item.harga
    return sum + hargaSatuan * item.qty
  }, 0)

  const potonganPromo = promoDiscount > 0
    ? Math.round(subtotal * promoDiscount / 100)
    : 0

  const subtotalSetelahPromo = subtotal - potonganPromo
  const totalAkhir = subtotalSetelahPromo + selectedOngkir

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    document.addEventListener('openCheckout', handleOpen)
    return () => document.removeEventListener('openCheckout', handleOpen)
  }, [])

  useEffect(() => {
    if (!ekspedisi || !wilayah.trim()) {
      setOngkirOptions([])
      setSelectedOngkir(0)
      return
    }

    const loadOngkir = async () => {
      if (isFetchingOngkir.current) return
      isFetchingOngkir.current = true
      setLoadingOngkir(true)

      try {
        const { data, error } = await supabase
          .from('ongkir')
          .select('*')
          .eq('ekspedisi', ekspedisi)
          // ilike = case-insensitive, jakarta/Jakarta/JAKARTA semua cocok
          .ilike('wilayah', wilayah.trim())
          .eq('aktif', true)

        if (error) throw error

        if (data && data.length > 0) {
          setOngkirOptions(data)
          setSelectedOngkir(data[0].biaya)
        } else {
          setOngkirOptions([])
          setSelectedOngkir(0)
        }
      } catch (error) {
        console.error('Error loading ongkir:', error)
        setOngkirOptions([])
        setSelectedOngkir(0)
      } finally {
        setLoadingOngkir(false)
        isFetchingOngkir.current = false
      }
    }

    loadOngkir()
  }, [ekspedisi, wilayah])

  if (!isOpen) return null

  const handleClose = () => {
    setIsOpen(false)
    closeCart()
  }

  const handleKirimWA = () => {
    if (!nama.trim()) { alert('Nama lengkap harus diisi!'); return }
    if (!hp.trim()) { alert('Nomor HP harus diisi!'); return }
    if (!alamat.trim()) { alert('Alamat harus diisi!'); return }
    if (!wilayah.trim()) { alert('Wilayah harus diisi!'); return }
    if (!ekspedisi) { alert('Pilih ekspedisi terlebih dahulu!'); return }
    if (selectedOngkir === 0 && ongkirOptions.length === 0 && ekspedisi) {
      alert('Ongkir untuk wilayah ini tidak tersedia. Hubungi kami untuk informasi ongkir.')
      return
    }

    const itemsList = cart.map(item => {
      const hargaSatuan = item.diskon > 0
        ? Math.round(item.harga * (1 - item.diskon / 100))
        : item.harga
      return '- ' + item.nama + ' x' + item.qty + ' = Rp ' + (hargaSatuan * item.qty).toLocaleString('id-ID')
    }).join('\n')

    const lines = [
      'Halo YM FURNITUR',
      'Saya ingin memesan:',
      '',
      '*PESANAN:*',
      itemsList,
      '',
      'Subtotal       : Rp ' + subtotal.toLocaleString('id-ID'),
    ]

    if (promoDiscount > 0) {
      lines.push('Diskon Promo   : -Rp ' + potonganPromo.toLocaleString('id-ID') + ' (' + promoDiscount + '%)')
    }

    lines.push(
      'Ongkos Kirim   : Rp ' + selectedOngkir.toLocaleString('id-ID'),
      '*TOTAL BAYAR   : Rp ' + totalAkhir.toLocaleString('id-ID') + '*',
      '',
      '*DATA PEMESAN:*',
      'Nama       : ' + nama,
      'No. HP     : ' + hp,
      'Alamat     : ' + alamat,
      'Wilayah    : ' + wilayah,
      'Ekspedisi  : ' + ekspedisi,
      'Pembayaran : DANA 088980723930',
    )

    if (catatan) lines.push('Catatan    : ' + catatan)
    lines.push('', 'Terima kasih')

    const msg = lines.join('\n')
    window.open('https://wa.me/6288980723930?text=' + encodeURIComponent(msg), '_blank')
    handleClose()
  }

  return (
    <div className="modal-overlay open" onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Form Pemesanan</h3>
          <button className="btn-close" onClick={handleClose}>X</button>
        </div>
        <div className="modal-body">

          {/* Ringkasan Harga */}
          <div style={{ background: 'linear-gradient(135deg,#1A1209,#3D2008)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
            <p style={{ color: '#C49A35', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Ringkasan Pesanan
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>

              <div style={{ background: 'rgba(196,154,53,0.12)', border: '1px solid rgba(196,154,53,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display,serif', color: '#C49A35' }}>{cart.length}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Item</div>
              </div>

              <div style={{ background: 'rgba(196,154,53,0.12)', border: '1px solid rgba(196,154,53,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C49A35' }}>
                  {'Rp ' + subtotal.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Subtotal</div>
              </div>

              <div style={{ background: 'rgba(196,154,53,0.12)', border: '1px solid rgba(196,154,53,0.25)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                {loadingOngkir ? (
                  <div style={{ fontSize: '0.75rem', color: '#C49A35' }}>Loading...</div>
                ) : (
                  <>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: selectedOngkir > 0 ? '#C49A35' : 'rgba(196,154,53,0.4)' }}>
                      {selectedOngkir > 0 ? 'Rp ' + selectedOngkir.toLocaleString('id-ID') : '-'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Ongkir</div>
                  </>
                )}
              </div>

              <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4ade80' }}>
                  {'Rp ' + totalAkhir.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(245,239,224,0.55)', marginTop: '2px' }}>Total Bayar</div>
              </div>
            </div>

            {promoDiscount > 0 && (
              <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '6px', fontSize: '0.78rem', color: '#4ade80' }}>
                {'Promo ' + promoDiscount + '% diterapkan - hemat Rp ' + potonganPromo.toLocaleString('id-ID')}
              </div>
            )}

            {!loadingOngkir && ekspedisi && wilayah && ongkirOptions.length === 0 && (
              <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', fontSize: '0.78rem', color: '#f87171' }}>
                {'Ongkir untuk wilayah ' + wilayah + ' via ' + ekspedisi + ' belum tersedia. Silakan hubungi kami.'}
              </div>
            )}
          </div>

          {/* Form Input */}
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
            <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos" />
          </div>

          <div className="form-group">
            <label>Wilayah / Kota *</label>
            <input
              type="text"
              value={wilayah}
              onChange={(e) => setWilayah(e.target.value)}
              placeholder="Contoh: jakarta, bandung, surabaya"
            />
          </div>

          <div className="form-group">
            <label>Pilih Ekspedisi *</label>
            <select value={ekspedisi} onChange={(e) => setEkspedisi(e.target.value)}>
              <option value="">Pilih Ekspedisi</option>
              <option value="JNE">JNE</option>
              <option value="J&T Express">J&T Express</option>
              <option value="Cargo Khusus Mebel">Cargo Khusus Mebel (Direkomendasikan)</option>
            </select>
          </div>

          {ongkirOptions.length > 1 && (
            <div className="form-group">
              <label>Pilih Layanan Ongkir</label>
              <select
                value={selectedOngkir}
                onChange={(e) => setSelectedOngkir(Number(e.target.value))}
              >
                {ongkirOptions.map((o) => (
                  <option key={o.id} value={o.biaya}>
                    {o.ekspedisi + ' - Rp ' + o.biaya.toLocaleString('id-ID') + ' (est. ' + o.estimasi_hari + ' hari)'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedOngkir > 0 && ongkirOptions.length === 1 && (
            <div style={{ padding: '10px 14px', background: 'rgba(196,154,53,0.08)', border: '1px solid rgba(196,154,53,0.2)', borderRadius: '8px', marginBottom: '12px', fontSize: '0.82rem', color: '#C49A35' }}>
              {ongkirOptions[0].ekspedisi + ' ke ' + wilayah + ' - Rp ' + selectedOngkir.toLocaleString('id-ID') + (ongkirOptions[0].estimasi_hari ? ' (est. ' + ongkirOptions[0].estimasi_hari + ' hari)' : '')}
            </div>
          )}

          <div className="form-group">
            <label>Catatan Pesanan</label>
            <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Warna finishing, ukuran custom, instruksi khusus, dll..." />
          </div>

          <button className="btn-checkout-wa" onClick={handleKirimWA}>
            Kirim Pesanan via WhatsApp
          </button>

        </div>
      </div>
    </div>
  )
}
