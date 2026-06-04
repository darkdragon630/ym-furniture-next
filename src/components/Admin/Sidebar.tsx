'use client'

export default function Sidebar({
  activeSection,
  onSectionChange,
}: {
  activeSection: string
  onSectionChange: (section: string) => void
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'produk', label: 'Produk', icon: 'fa-box' },
    { id: 'kategori', label: 'Kategori', icon: 'fa-tags' },
    { id: 'transaksi', label: 'Transaksi', icon: 'fa-shopping-cart' },
    { id: 'testimoni', label: 'Testimoni', icon: 'fa-star' },
    { id: 'promo', label: 'Promo', icon: 'fa-percent' },
    { id: 'ongkir', label: 'Ongkir', icon: 'fa-truck' },
    { id: 'grafik', label: 'Grafik', icon: 'fa-chart-bar' },
    { id: 'backup', label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'log', label: 'Aktivitas Log', icon: 'fa-history' },
    { id: 'footer', label: 'Footer', icon: 'fa-edit' },
    { id: 'pengaturan', label: 'Pengaturan', icon: 'fa-cog' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>YM FURNITUR</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            {/* ✅ FIX: Ganti <a href="#"> dengan <button> — tidak ada href side-effect */}
            <button
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => onSectionChange(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
