-- Chat privado profesor-estudiante. Aplicar en Supabase SQL Editor tras verificar el correo administrador.
create table if not exists public.chat_mensajes (
 id bigint generated always as identity primary key,
 estudiante_id uuid not null references public.estudiantes(id) on delete cascade,
 remitente_id uuid not null references auth.users(id),
 remitente_rol text not null check(remitente_rol in ('estudiante','docente')),
 contenido text not null check(char_length(btrim(contenido)) between 1 and 1000),
 leido_at timestamptz,
 creado_at timestamptz not null default now()
);
create index if not exists chat_mensajes_conversacion_idx on public.chat_mensajes(estudiante_id,creado_at desc);
alter table public.chat_mensajes enable row level security;
-- Coincidir con el correo de administración configurado en App.jsx.
create policy "leer chat privado" on public.chat_mensajes for select to authenticated using (
 estudiante_id=auth.uid() or lower(coalesce(auth.jwt()->>'email',''))='patriciaolaya23@gmail.com'
);
create policy "enviar chat privado" on public.chat_mensajes for insert to authenticated with check (
 remitente_id=auth.uid() and (
 (remitente_rol='estudiante' and estudiante_id=auth.uid())
 or (remitente_rol='docente' and lower(coalesce(auth.jwt()->>'email',''))='patriciaolaya23@gmail.com')
 )
);
-- No permitir modificaciones ni borrados desde cliente.
-- Los mensajes son privados por RLS; nunca publicar esta tabla con políticas anónimas.
