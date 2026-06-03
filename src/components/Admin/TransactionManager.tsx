'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data transaksi
interface Transaction {
  id: number
  kode_transaksi: string
  nama_pelanggan: string
  no_hp: string
  alamat: string
  ekspedisi: string | null
  total: number
  status: string
  catatan: string | null
  created_at: string
}

interface TransactionDetail {
  id: number
  transaksi_id: number
  produk_id: number
  qty: number
  harga: number
  produk?: {
    id: number
    nama: string
    harga: number
  }
}

export default function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([])

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadTransactions = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('transaksi')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      if (isMounted.current) {
        setTransactions(data || [])
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadTransactions()
    
    return () => {
      isMounted.current = false
    }
  }, [loadTransactions])

  const updateStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('transaksi')
        .update({ status })
        .eq('id', id)
      
      if (error) throw error
      loadTransactions()
    } catch (error) {
      console.error('Error updating status:', error)
      if (error instanceof Error) {
        alert('Gagal update status: ' + error.message)
      } else {
        alert('Gagal update status: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const viewDetail = async (id: number) => {
    try {
      // Load detail transaksi dengan join ke produk
      const { data, error } = await supabase
        .from('detail_transaksi')
        .select('*, produk(*)')
        .eq('transaksi_id', id)
      
      if (error) throw error
      
      // Load transaksi utama
      const { data: trans, error: transError } = await supabase
        .from('transaksi')
        .select('*')
        .eq('id', id)
        .single()
      
      if (transError) throw transError
      
      setSelectedTransaction(trans)
      setTransactionDetails(data || [])
      setIsDetailModalOpen(true)
    } catch (error) {
      console.error('Error loading transaction detail:', error)
      if (error instanceof Error) {
        alert('Gagal load detail transaksi: ' + error.message)
      } else {
        alert('Gagal load detail transaksi: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTransaction(null)
    setTransactionDetails([])
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-shopping-cart"></i> Manajemen Transaksi</h2>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Kode</th>
              <th>Pelanggan</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t: Transaction) => (
              <tr key={t.id}>
                <td><strong>{t.kode_transaksi}</strong></td>
                <td>{t.nama_pelanggan}</td>
                <td>Rp {t.total?.toLocaleString()}</td>
                <td>
                  <select 
                    onChange={(e) => updateStatus(t.id, e.target.value)} 
                    value={t.status}
                    className="status-select"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="process">📦 Diproses</option>
                    <option value="shipped">🚚 Dikirim</option>
                    <option value="done">✅ Selesai</option>
                    <option value="cancel">❌ Batal</option>
                  </select>
                </td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn-small" 
                    onClick={() => viewDetail(t.id)}
                  >
                    👁️ Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTransaction && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Detail Transaksi</h3>
              <button className="btn-close" onClick={closeDetailModal}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Kode:</strong> {selectedTransaction.kode_transaksi}</p>
                <p><strong>Pelanggan:</strong> {selectedTransaction.nama_pelanggan}</p>
                <p><strong>Status:</strong> {selectedTransaction.status}</p>
                <p><strong>Tanggal:</strong> {new Date(selectedTransaction.created_at).toLocaleString()}</p>
                <p><strong>Total:</strong> Rp {selectedTransaction.total?.toLocaleString()}</p>
              </div>

              <h4>Item Pesanan</h4>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th>Qty</th>
                      <th>Harga</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionDetails.map((d: TransactionDetail) => (
                      <tr key={d.id}>
                        <td>{d.produk?.nama || 'Produk tidak ditemukan'}</td>
                        <td>{d.qty}</td>
                        <td>Rp {d.harga?.toLocaleString()}</td>
                        <td>Rp {(d.harga * d.qty).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}