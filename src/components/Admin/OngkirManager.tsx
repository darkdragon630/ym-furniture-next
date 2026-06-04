'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Definisikan interface untuk data ongkir
interface Ongkir {
  id: number
  ekspedisi: string
  wilayah: string
  biaya: number
  estimasi_hari: number
  aktif: boolean
  created_at: string
}

export default function OngkirManager() {
  const [ongkirList, setOngkirList] = useState<Ongkir[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOngkir, setEditingOngkir] = useState<Ongkir | null>(null)
  const [formData, setFormData] = useState({
    ekspedisi: '',
    wilayah: '',
    biaya: '',
    estimasi_hari: '1',
    aktif: true,
  })

  useEffect(() => {
    loadOngkir()
  }, [])

  const loadOngkir = async () => {
    try {
      const { data, error } = await supabase
        .from('ongkir')
        .select('*')
        .order('id', { ascending: false })
      
      if (error) throw error
      setOngkirList(data || [])
    } catch (error) {
      console.error('Error loading ongkir:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        ekspedisi: formData.ekspedisi,
        wilayah: formData.wilayah,
        biaya: parseInt(formData.biaya),
        estimasi_hari: parseInt(formData.estimasi_hari),
        aktif: formData.aktif,
      }

      if (editingOngkir) {
        const { error } = await supabase
          .from('ongkir')
          .update(data)
          .eq('id', editingOngkir.id)
        
        if (error) throw error
        alert('Ongkir berhasil diupdate!')
      } else {
        const { error } = await supabase
          .from('ongkir')
          .insert([data])
        
        if (error) throw error
        alert('Ongkir berhasil ditambahkan!')
      }
      
      setIsModalOpen(false)
      setEditingOngkir(null)
      loadOngkir()
    } catch (error) {
      console.error('Error saving ongkir:', error)
      // ✅ Type guard untuk error
      if (error instanceof Error) {
        alert('Gagal menyimpan ongkir: ' + error.message)
      } else {
        alert('Gagal menyimpan ongkir: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus ongkir ini?')) return
    
    try {
      const { error } = await supabase
        .from('ongkir')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Ongkir berhasil dihapus!')
      loadOngkir()
    } catch (error) {
      console.error('Error deleting ongkir:', error)
      // ✅ Type guard untuk error
      if (error instanceof Error) {
        alert('Gagal menghapus ongkir: ' + error.message)
      } else {
        alert('Gagal menghapus ongkir: Terjadi kesalahan yang tidak diketahui')
      }
    }
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-truck"></i> Manajemen Ongkir</h2>
        <button className="btn-primary" onClick={() => {
          setEditingOngkir(null)
          setFormData({
            ekspedisi: '',
            wilayah: '',
            biaya: '',
            estimasi_hari: '1',
            aktif: true,
          })
          setIsModalOpen(true)
        }}>
          <i className="fas fa-plus"></i> Tambah Ongkir
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ekspedisi</th>
              <th>Wilayah</th>
              <th>Biaya</th>
              <th>Estimasi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {ongkirList.map((o: Ongkir) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td><strong>{o.ekspedisi}</strong></td>
                <td>{o.wilayah}</td>
                <td>Rp {o.biaya.toLocaleString()}</td>
                <td>{o.estimasi_hari} hari</td>
                <td>
                  <span className={`badge ${o.aktif ? 'badge-success' : 'badge-danger'}`}>
                    {o.aktif ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-small" 
                    onClick={() => {
                      setEditingOngkir(o)
                      setFormData({
                        ekspedisi: o.ekspedisi,
                        wilayah: o.wilayah,
                        biaya: o.biaya.toString(),
                        estimasi_hari: o.estimasi_hari.toString(),
                        aktif: o.aktif,
                      })
                      setIsModalOpen(true)
                    }}
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-small btn-danger" 
                    onClick={() => handleDelete(o.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingOngkir ? 'Edit Ongkir' : 'Tambah Ongkir'}</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Ekspedisi</label>
                  <input
                    type="text"
                    value={formData.ekspedisi}
                    onChange={(e) => setFormData({ ...formData, ekspedisi: e.target.value })}
                    placeholder="JNE, J&T, Cargo"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Wilayah</label>
                  <input
                    type="text"
                    value={formData.wilayah}
                    onChange={(e) => setFormData({ ...formData, wilayah: e.target.value })}
                    placeholder="Jakarta, Bandung, Surabaya"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Biaya Ongkir (Rp)</label>
                  <input
                    type="number"
                    value={formData.biaya}
                    onChange={(e) => setFormData({ ...formData, biaya: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estimasi Hari</label>
                  <input
                    type="number"
                    value={formData.estimasi_hari}
                    onChange={(e) => setFormData({ ...formData, estimasi_hari: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.aktif}
                      onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                    />
                    Aktif
                  </label>
                </div>
                <button type="submit" className="btn-primary btn-full">Simpan</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
