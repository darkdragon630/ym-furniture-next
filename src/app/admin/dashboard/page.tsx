'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Admin/Sidebar'
import { useAdmin } from '@/hooks/useAdmin'
import { supabase } from '@/lib/supabase'
import ProductManager from '@/components/Admin/ProductManager'
import CategoryManager from '@/components/Admin/CategoryManager'
import TransactionManager from '@/components/Admin/TransactionManager'
import TestimonialManager from '@/components/Admin/TestimonialManager'
import PromoManager from '@/components/Admin/PromoManager'
import OngkirManager from '@/components/Admin/OngkirManager'
import Chart from '@/components/Admin/Chart'
import BackupManager from '@/components/Admin/BackupManager'
import LogManager from '@/components/Admin/LogManager'
import FooterManager from '@/components/Admin/FooterManager'
import SettingsManager from '@/components/Admin/SettingsManager'

export default function AdminDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [stats, setStats] = useState({
    totalProduk: 0,
    transaksiHariIni: 0,
    totalPendapatan: 0,
    totalPelanggan: 0,
  })

  // Gunakan ref untuk mencegah multiple fetch
  const isMounted = useRef(true)
  const isFetching = useRef(false)

  const { checkAdminSession, adminLogout } = useAdmin()

  const loadStats = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch semua data sekaligus dengan Promise.all
      const [produkResult, transaksiResult, pendapatanResult] = await Promise.all([
        supabase
          .from('produk')
          .select('*', { count: 'exact', head: true }),
        supabase
          .from('transaksi')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today),
        supabase
          .from('transaksi')
          .select('total')
          .eq('status', 'done')
      ])

      const produkCount = produkResult.count || 0
      const transaksiCount = transaksiResult.count || 0
      const totalPendapatan = pendapatanResult.data?.reduce((sum, t) => sum + t.total, 0) || 0

      if (isMounted.current) {
        setStats({
          totalProduk: produkCount,
          transaksiHariIni: transaksiCount,
          totalPendapatan: totalPendapatan,
          totalPelanggan: 0,
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    
    // Cek session
    if (!checkAdminSession()) {
      router.push('/admin/login')
      return
    }
    
    // Load stats sekali saja
    loadStats()
    setIsLoading(false)
    
    // Cleanup saat component unmount
    return () => {
      isMounted.current = false
    }
  }, [checkAdminSession, router, loadStats])

  const handleLogout = () => {
    adminLogout()
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="card-grid">
              <div className="card">
                <div className="card-icon"><i className="fas fa-box"></i></div>
                <div className="card-content">
                  <h3>Total Produk</h3>
                  <div className="value">{stats.totalProduk}</div>
                </div>
              </div>
              <div className="card">
                <div className="card-icon"><i className="fas fa-shopping-cart"></i></div>
                <div className="card-content">
                  <h3>Transaksi Hari Ini</h3>
                  <div className="value">{stats.transaksiHariIni}</div>
                </div>
              </div>
              <div className="card">
                <div className="card-icon"><i className="fas fa-users"></i></div>
                <div className="card-content">
                  <h3>Total Pelanggan</h3>
                  <div className="value">{stats.totalPelanggan}</div>
                </div>
              </div>
              <div className="card">
                <div className="card-icon"><i className="fas fa-money-bill-wave"></i></div>
                <div className="card-content">
                  <h3>Pendapatan</h3>
                  <div className="value">Rp {stats.totalPendapatan.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <Chart />
          </>
        )
      case 'produk':
        return <ProductManager />
      case 'kategori':
        return <CategoryManager />
      case 'transaksi':
        return <TransactionManager />
      case 'testimoni':
        return <TestimonialManager />
      case 'promo':
        return <PromoManager />
      case 'ongkir':
        return <OngkirManager />
      case 'grafik':
        return <Chart />
      case 'backup':
        return <BackupManager />
      case 'log':
        return <LogManager />
      case 'footer':
        return <FooterManager />
      case 'pengaturan':
        return <SettingsManager />
      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="main-content">
        <div className="header-admin">
          <div className="header-left">
            <h1>Dashboard <span>Admin</span></h1>
          </div>
          <div className="header-right">
            <div className="clock-display">
              {new Date().toLocaleTimeString()}
            </div>
            <span className="sid-display">SID: {sessionStorage.getItem('ym_sid')}</span>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        {renderSection()}
      </main>
    </div>
  )
}
