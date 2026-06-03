'use client'

import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function BackupManager() {
  const [isLoading, setIsLoading] = useState(false)
  const isMounted = useRef(true)

  const handleBackup = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    
    try {
      const tables = ['produk', 'kategori', 'transaksi', 'detail_transaksi', 'testimoni', 'aktivitas_log']
      const backup: Record<string, any> = {}
      
      for (const table of tables) {
        const { data } = await supabase.from(table).select('*')
        backup[table] = data
      }
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_ym_furnitur_${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Backup error:', error)
      alert('Gagal backup: ' + error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as Record<string, any>
        for (const [table, records] of Object.entries(data)) {
          const recordsArray = records as any[]
          if (recordsArray.length > 0) {
            await supabase.from(table).insert(recordsArray)
          }
        }
        alert('Restore berhasil!')
        window.location.reload()
      } catch (err) {
        // ✅ Type guard: pastikan err adalah instance Error
        if (err instanceof Error) {
          alert('Gagal restore: ' + err.message)
        } else {
          alert('Gagal restore: Terjadi kesalahan yang tidak diketahui')
        }
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-database"></i> Backup & Restore</h2>
      </div>
      <div className="backup-actions">
        <button className="btn-primary" onClick={handleBackup} disabled={isLoading}>
          <i className="fas fa-download"></i> {isLoading ? 'Memproses...' : 'Backup Data'}
        </button>
        <button className="btn-outline" onClick={() => document.getElementById('restoreFile')?.click()} disabled={isLoading}>
          <i className="fas fa-upload"></i> {isLoading ? 'Memproses...' : 'Restore Data'}
        </button>
        <input type="file" id="restoreFile" accept=".json" style={{ display: 'none' }} onChange={handleRestore} />
      </div>
    </div>
  )
}