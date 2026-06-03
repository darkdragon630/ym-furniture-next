import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface OrderItem {
  id: number
  qty: number
  harga: number
  [key: string]: unknown
}

interface OrderData {
  nama: string
  hp: string
  total: number
  items: OrderItem[]
  [key: string]: unknown
}

interface Transaction {
  id: number
  nama_pelanggan: string
  total: number
  status: string
  kode_transaksi: string
  [key: string]: unknown
}

Deno.serve(async (req: Request) => {
  try {
    const { orderData } = (await req.json()) as { orderData: OrderData }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )
    
    // Validasi data
    if (!orderData.nama || !orderData.hp) {
      return new Response(
        JSON.stringify({ error: 'Data tidak lengkap' }),
        { status: 400 }
      )
    }
    
    // Simpan transaksi
    const { data: transaction, error } = await supabase
      .from('transaksi')
      .insert([{
        nama_pelanggan: orderData.nama,
        total: orderData.total,
        status: 'pending',
        kode_transaksi: `TRX-${Date.now()}`,
      }])
      .select()
      .single()
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      )
    }
    
    // Simpan detail transaksi
    const detailItems = orderData.items.map((item: OrderItem) => ({
      transaksi_id: transaction.id,
      produk_id: item.id,
      qty: item.qty,
      harga: item.harga,
    }))
    
    await supabase
      .from('detail_transaksi')
      .insert(detailItems)
    
    // Kirim notifikasi WhatsApp
    const message = `Pesanan baru dari ${orderData.nama}\nTotal: Rp ${orderData.total.toLocaleString()}`
    
    // Notify via WhatsApp API (dummy)
    console.log('WhatsApp notification:', message)
    
    return new Response(
      JSON.stringify({ success: true, transaction }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    )
  }
})