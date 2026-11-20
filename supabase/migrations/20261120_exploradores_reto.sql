-- Permiso individual para el desafío avanzado de Nivel 1.
ALTER TABLE public.estudiantes ADD COLUMN IF NOT EXISTS reto_explorador_habilitado boolean NOT NULL DEFAULT false;
-- Mantener las políticas RLS existentes de estudiantes: solo administradores deben poder cambiar este permiso.
