'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Log {
  id: number
  admin_email: string
  aksi: string
  detail: string
  created_at: string
}

export default function LogManager() {
  const [logs, setLogs] = useState<Log[]>([])

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadLogs = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('aktivitas_log')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      if (isMounted.current) {
        setLogs(data || [])
      }
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadLogs()
    
    return () => {
      isMounted.current = false
    }
  }, [loadLogs])

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-history"></i> Aktivitas Log</h2>
      </div>
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Admin</th>
              <th>Aksi</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: Log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.admin_email}</td>
                <td>{log.aksi}</td>
                <td>{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}