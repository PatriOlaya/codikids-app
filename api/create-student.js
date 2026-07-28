import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  const { nombre, email, password, nivel = 2 } = req.body

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' })
  }

  // Cliente admin con service role key (solo disponible en el servidor)
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  try {
    // 1. Crear usuario en Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true // confirmar email automáticamente
    })

    if (authError) return res.status(400).json({ error: authError.message })

    const userId = authData.user.id

    // 2. Crear perfil en tabla estudiantes
    const { error: dbError } = await supabaseAdmin
      .from('estudiantes')
      .insert({
        id: userId,
        nombre,
        nivel,
        xp_total: 0,
        racha_dias: 0,
        inventos_count: 0,
        avatar_config: {}
      })

    if (dbError) {
      // Si falla la BD, eliminar el usuario de auth para no dejar inconsistencias
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return res.status(400).json({ error: dbError.message })
    }

    return res.status(200).json({ 
      success: true, 
      userId,
      email,
      nombre
    })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
