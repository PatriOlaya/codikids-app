import { allowPost, requireAdmin } from './_auth.js'

export default async function handler(req, res) {
  if (!allowPost(req, res)) return
  const auth = await requireAdmin(req, res)
  if (!auth) return

  const { nombre, email, password, nivel = 1 } = req.body || {}
  const cleanName = String(nombre || '').trim()
  const cleanEmail = String(email || '').trim().toLowerCase()
  const parsedLevel = Number(nivel)

  if (!cleanName || !cleanEmail || !password) return res.status(400).json({ error: 'Faltan campos obligatorios' })
  if (cleanName.length > 80 || cleanEmail.length > 254 || String(password).length < 8) {
    return res.status(400).json({ error: 'Revisa nombre, correo y contraseña (mínimo 8 caracteres).' })
  }
  if (![1, 2, 3].includes(parsedLevel)) return res.status(400).json({ error: 'Nivel inválido' })

  const { supabaseAdmin } = auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true
  })
  if (authError) return res.status(400).json({ error: authError.message })

  const userId = authData.user.id
  const { error: dbError } = await supabaseAdmin.from('estudiantes').insert({
    id: userId, nombre: cleanName, nivel: parsedLevel, xp_total: 0, racha_dias: 0, inventos_count: 0, avatar_config: {}
  })
  if (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return res.status(400).json({ error: dbError.message })
  }
  return res.status(201).json({ success: true, userId, email: cleanEmail, nombre: cleanName })
}
