'use client'

import { useEffect } from 'react'

export default function Sidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string
  onSectionChange: (section: string) => void
}) {
  const menuItems = [
    { id: 'dashboard',  label: 'Dashboard',       icon: 'fa-chart-pie' },
    { id: 'produk',     label: 'Produk',           icon: 'fa-box' },
    { id: 'kategori',   label: 'Kategori',         icon: 'fa-tags' },
    { id: 'transaksi',  label: 'Transaksi',        icon: 'fa-shopping-cart' },
    { id: 'testimoni',  label: 'Testimoni',        icon: 'fa-star' },
    { id: 'promo',      label: 'Promo',            icon: 'fa-percent' },
    { id: 'ongkir',     label: 'Ongkir',           icon: 'fa-truck' },
    { id: 'grafik',     label: 'Grafik',           icon: 'fa-chart-bar' },
    { id: 'backup',     label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'log',        label: 'Aktivitas Log',    icon: 'fa-history' },
    { id: 'footer',     label: 'Footer',           icon: 'fa-edit' },
    { id: 'pengaturan', label: 'Pengaturan',       icon: 'fa-cog' },
  ]

  useEffect(() => {
    const existing = document.querySelector('link[href*="font-awesome"], link[href*="fontawesome"]')
    if (!existing) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
      document.head.appendChild(link)
    }
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>YM FURNITUR</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id}>
            
              href="#"
              className={activeSection === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault()
                onSectionChange(item.id)
              }}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
