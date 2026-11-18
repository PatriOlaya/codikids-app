-- Registro mínimo de uso de juegos. Ejecutar en Supabase antes de publicar.
create table if not exists public.actividad_juegos (
 id bigint generated always as identity primary key,
 estudiante_id uuid not null references auth.users(id) on delete cascade,
 juego text not null check (juego in ('turbo','nucita','islas','robot','circuito','espacio')),
 evento text not null check (evento in ('abrir','cerrar')),
 fecha timestamptz not null default now(),
 duracion_segundos integer check (duracion_segundos is null or duracion_segundos between 0 and 14400)
);
create index if not exists actividad_juegos_fecha_idx on public.actividad_juegos(fecha desc);
create index if not exists actividad_juegos_estudiante_idx on public.actividad_juegos(estudiante_id,fecha desc);
alter table public.actividad_juegos enable row level security;
create policy "estudiante registra actividad propia" on public.actividad_juegos for insert to authenticated with check(estudiante_id=auth.uid());
-- El correo de administración debe coincidir con VITE_ADMIN_EMAIL (predeterminado en App.jsx).
-- IMPORTANTE: para producción se recomienda rol admin persistente en base de datos.
create policy "admin consulta actividad" on public.actividad_juegos for select to authenticated using (
 lower(coalesce(auth.jwt()->>'email','')) = 'patriciaolaya23@gmail.com'
);
-- No existen políticas de UPDATE o DELETE para estudiantes.
