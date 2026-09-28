import { allowPost, requireAdmin } from './_auth.js'

export default async function handler(req, res) {
  if (!allowPost(req, res)) return
  const auth = await requireAdmin(req, res)
  if (!auth) return

  const { userId } = req.body || {}
  if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'Falta userId' })

  const { supabaseAdmin } = auth
  const { error: dbError } = await supabaseAdmin.from('estudiantes').delete().eq('id', userId)
  if (dbError) return res.status(400).json({ error: dbError.message })

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (authError) return res.status(400).json({ error: authError.message })
  return res.status(200).json({ success: true })
}
