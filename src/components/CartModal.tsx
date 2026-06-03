'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CartModal() {
  const router = useRouter()
  const {
    cart,
    isCartOpen,
    closeCart,
    cartCount,
    totalPrice,
    removeFromCart,
    updateQuantity,
    applyPromo,
    promoDiscount,
    openCheckout,
  } = useCart()

  if (!isCartOpen) return null

  const subtotal = cart.reduce((sum, item) => {
    const price = item.diskon > 0 
      ? Math.round(item.harga * (1 - item.diskon / 100)) 
      : item.harga
    return sum + price * item.qty
  }, 0)

  const potongan = Math.round(subtotal * promoDiscount / 100)
  const total = subtotal - potongan

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    const input = document.getElementById('promoInput') as HTMLInputElement
    const code = input.value
    const success = applyPromo(code)
    
    const statusEl = document.getElementById('promoStatus')
    if (success) {
      statusEl!.className = 'promo-status ok'
      statusEl!.textContent = `✅ Kode berhasil! Diskon ${promoDiscount}% diterapkan.`
    } else {
      statusEl!.className = 'promo-status err'
      statusEl!.textContent = '❌ Kode promo tidak valid.'
    }
  }

  const handleCheckout = () => {
    closeCart() // Tutup modal keranjang
    openCheckout() // Buka modal checkout
  }

  return (
    <div className="modal-overlay open" onClick={closeCart}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🛒 Keranjang Belanja</h3>
          <button className="btn-close" onClick={closeCart}>✕</button>
        </div>
        <div className="modal-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon">🛒</div>
              <p>Keranjang masih kosong</p>
              <button className="btn-primary" onClick={() => {
                closeCart()
                router.push('#produk')
              }}>
                Lihat Produk
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img">
                    {item.gambar ? (
                      <img 
                        src={item.gambar} 
                        alt={item.nama} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>🪑</span>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.nama}</div>
                    <div className="cart-item-price">
                      Rp {(item.diskon > 0 ? Math.round(item.harga * (1 - item.diskon / 100)) : item.harga).toLocaleString()} / pcs
                    </div>
                    <div className="cart-qty">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                      <span className="qty-num">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      <span style={{ fontSize: '0.82rem', color: '#8A7A6A', marginLeft: '8px' }}>
                        = Rp {(item.diskon > 0 ? Math.round(item.harga * (1 - item.diskon / 100)) : item.harga * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className="btn-hapus" onClick={() => removeFromCart(item.id)}>🗑️ Hapus</button>
                </div>
              ))}

              <div className="promo-input-row">
                <input type="text" className="promo-input" id="promoInput" placeholder="Masukkan kode promo..." />
                <button className="btn-apply-promo" onClick={handleApplyPromo}>Terapkan</button>
              </div>
              <div className="promo-status" id="promoStatus"></div>

              <div className="cart-total">
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#8A7A6A' }}>
                    Subtotal: Rp {subtotal.toLocaleString()}
                  </div>
                  {promoDiscount > 0 && (
                    <div style={{ fontSize: '0.82rem', color: 'green' }}>
                      Diskon promo ({promoDiscount}%): -Rp {potongan.toLocaleString()}
                    </div>
                  )}
                </div>
                <strong>Total: Rp {total.toLocaleString()}</strong>
              </div>

              <button className="btn-checkout-wa" onClick={handleCheckout}>
                Lanjut ke Checkout →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}