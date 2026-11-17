-- Ejecutar manualmente en Supabase SQL Editor antes de habilitar el módulo.
create table if not exists public.web_matriculas (
 estudiante_id uuid primary key references auth.users(id) on delete cascade,
 activa boolean not null default false,
 clases_habilitadas integer not null default 1 check (clases_habilitadas between 1 and 8),
 created_at timestamptz default now()
);
create table if not exists public.web_proyectos (
 estudiante_id uuid primary key references auth.users(id) on delete cascade,
 titulo text not null default 'Mi Mundo Digital',
 tema text not null default 'espacio',
 descripcion text not null default '¡Bienvenidos a mi página!',
 color text not null default '#6654db',
 html text not null default '',
 css text not null default '',
 updated_at timestamptz not null default now()
);
alter table public.web_matriculas enable row level security;
alter table public.web_proyectos enable row level security;
create policy "matricula propia lectura" on public.web_matriculas for select to authenticated using (estudiante_id=auth.uid());
create policy "proyecto propio lectura con matricula" on public.web_proyectos for select to authenticated using (estudiante_id=auth.uid() and exists(select 1 from public.web_matriculas m where m.estudiante_id=auth.uid() and m.activa));
create policy "proyecto propio insertar con matricula" on public.web_proyectos for insert to authenticated with check (estudiante_id=auth.uid() and exists(select 1 from public.web_matriculas m where m.estudiante_id=auth.uid() and m.activa));
create policy "proyecto propio actualizar con matricula" on public.web_proyectos for update to authenticated using (estudiante_id=auth.uid() and exists(select 1 from public.web_matriculas m where m.estudiante_id=auth.uid() and m.activa)) with check (estudiante_id=auth.uid());
-- Matricular desde el panel SQL, usando el UUID real del estudiante:
-- insert into public.web_matriculas(estudiante_id,activa,clases_habilitadas) values ('UUID-AQUI',true,1)
-- on conflict(estudiante_id) do update set activa=true;
-- No se permite a estudiantes cambiar su matrícula.