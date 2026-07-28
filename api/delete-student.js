import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  res.setHeader('Access-Control-Allow-Origin', '*')

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Falta userId' })

  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    await supabaseAdmin.from('estudiantes').delete().eq('id', userId)
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
