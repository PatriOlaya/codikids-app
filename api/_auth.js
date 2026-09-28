import { createClient } from '@supabase/supabase-js'

function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!url || !serviceKey) throw new Error('Supabase server configuration is incomplete')
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
}

export async function requireAdmin(req, res) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) {
    res.status(401).json({ error: 'No autorizado' })
    return null
  }

  const supabaseAdmin = getAdminClient()
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()

  if (error || !data?.user || !adminEmail || data.user.email?.toLowerCase() !== adminEmail) {
    res.status(403).json({ error: 'Acceso denegado' })
    return null
  }
  return { supabaseAdmin, user: data.user }
}

export function allowPost(req, res) {
  res.setHeader('Allow', 'POST')
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return false
  }
  return true
}
