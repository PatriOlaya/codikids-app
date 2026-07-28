import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
    // Consulta mínima solo para mantener el proyecto activo
    await supabase.from('estudiantes').select('id').limit(1)
    res.status(200).json({ ok: true, timestamp: new Date().toISOString() })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
}
