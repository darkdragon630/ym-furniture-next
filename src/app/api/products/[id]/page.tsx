import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  // ✅ Ambil cookies dengan await
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const { data: product } = await supabase
    .from('produk')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan - YM FURNITUR',
    }
  }
  
  return {
    title: `${product.nama} - YM FURNITUR`,
    description: product.deskripsi || `Produk ${product.nama} dari YM FURNITUR`,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // ✅ Ambil cookies dengan await
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const { data: product } = await supabase
    .from('produk')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (!product) {
    notFound()
  }
  
  const price = product.diskon > 0 
    ? Math.round(product.harga * (1 - product.diskon / 100))
    : product.harga
  
  return (
    <div className="product-detail-container">
      <div className="product-detail-image">
        {product.gambar ? (
          <Image
            src={product.gambar}
            alt={product.nama}
            width={600}
            height={600}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ fontSize: '8rem', textAlign: 'center' }}>🪑</div>
        )}
      </div>
      <div className="product-detail-info">
        <h1>{product.nama}</h1>
        <p className="product-category">{product.kategori}</p>
        <div className="product-price">
          <span className="price-now">Rp {price.toLocaleString()}</span>
          {product.diskon > 0 && (
            <span className="price-old">Rp {product.harga.toLocaleString()}</span>
          )}
        </div>
        <p className="product-description">{product.deskripsi}</p>
        <button className="btn-primary">Tambah ke Keranjang</button>
      </div>
    </div>
  )
}