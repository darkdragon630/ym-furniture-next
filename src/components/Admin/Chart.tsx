'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { supabase } from '@/lib/supabase'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }[]
}

export default function Chart() {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  })

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const loadChartData = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const { data, error } = await supabase
        .from('transaksi')
        .select('created_at, total')
        .order('created_at', { ascending: true })
      
      if (error) throw error

      if (data && data.length > 0 && isMounted.current) {
        // ✅ Type untuk grouped object
        const grouped: Record<string, number> = {}
        data.forEach((t: any) => {
          const date = new Date(t.created_at).toLocaleDateString()
          grouped[date] = (grouped[date] || 0) + t.total
        })

        setChartData({
          labels: Object.keys(grouped),
          datasets: [{
            label: 'Penjualan (Rp)',
            data: Object.values(grouped),
            backgroundColor: 'rgba(196, 154, 53, 0.5)',
            borderColor: '#C49A35',
            borderWidth: 2
          }]
        })
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    loadChartData()
    
    return () => {
      isMounted.current = false
    }
  }, [loadChartData])

  if (chartData.labels.length === 0) {
    return (
      <div className="admin-section">
        <div className="section-header">
          <h2><i className="fas fa-chart-bar"></i> Grafik Penjualan</h2>
        </div>
        <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#8A7A6A' }}>Belum ada data transaksi</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2><i className="fas fa-chart-bar"></i> Grafik Penjualan</h2>
      </div>
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  )
}