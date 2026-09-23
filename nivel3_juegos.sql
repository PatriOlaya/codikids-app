-- Ejecutar una vez en el SQL Editor de Supabase del proyecto CODIKIDS.
-- Cada estudiante conserva únicamente sus propias clases programadas.
create table if not exists public.nivel3_juegos (
  estudiante_id uuid primary key references public.estudiantes(id) on delete cascade,
  clases_programadas jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint clases_programadas_array check (jsonb_typeof(clases_programadas) = 'array')
);
alter table public.nivel3_juegos enable row level security;
grant select, insert, update on public.nivel3_juegos to authenticated;
drop policy if exists "estudiante lee su juego" on public.nivel3_juegos;
create policy "estudiante lee su juego" on public.nivel3_juegos for select to authenticated using (estudiante_id = auth.uid());
drop policy if exists "estudiante crea su juego" on public.nivel3_juegos;
create policy "estudiante crea su juego" on public.nivel3_juegos for insert to authenticated with check (estudiante_id = auth.uid() and exists (select 1 from public.estudiantes where id = auth.uid() and nivel = 3));
drop policy if exists "estudiante actualiza su juego" on public.nivel3_juegos;
create policy "estudiante actualiza su juego" on public.nivel3_juegos for update to authenticated using (estudiante_id = auth.uid()) with check (estudiante_id = auth.uid());
