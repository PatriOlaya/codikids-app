-- EJECUTA ESTO EN EL SQL EDITOR DE SUPABASE
-- Tabla de estudiantes (vinculada a auth.users)
create table public.estudiantes (
  id uuid references auth.users(id) primary key,
  nombre text not null,
  nivel integer default 2,
  xp_total integer default 0,
  racha_dias integer default 0,
  inventos_count integer default 0,
  created_at timestamp with time zone default now()
);

-- Tabla de misiones
create table public.misiones (
  id serial primary key,
  numero integer not null,
  nivel integer not null,
  titulo text not null,
  descripcion text,
  xp_reward integer default 80,
  elemento_planeta text not null  -- qué aparece en el planeta al completarla
);

-- Tabla de progreso del estudiante
create table public.progreso (
  id serial primary key,
  estudiante_id uuid references public.estudiantes(id) on delete cascade,
  mision_id integer references public.misiones(id),
  completada boolean default false,
  completada_at timestamp with time zone,
  unique(estudiante_id, mision_id)
);

-- Tabla de inventos (proyectos de Scratch)
create table public.inventos (
  id serial primary key,
  estudiante_id uuid references public.estudiantes(id) on delete cascade,
  mision_id integer references public.misiones(id),
  titulo text not null,
  descripcion text,
  scratch_url text,
  imagen_url text,
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table public.estudiantes enable row level security;
alter table public.progreso enable row level security;
alter table public.inventos enable row level security;

-- Políticas: cada estudiante solo ve sus propios datos
create policy "estudiante ve su perfil"
  on public.estudiantes for select
  using (auth.uid() = id);

create policy "estudiante ve su progreso"
  on public.progreso for select
  using (auth.uid() = estudiante_id);

create policy "estudiante inserta su progreso"
  on public.progreso for insert
  with check (auth.uid() = estudiante_id);

create policy "estudiante actualiza su progreso"
  on public.progreso for update
  using (auth.uid() = estudiante_id);

create policy "estudiante ve sus inventos"
  on public.inventos for select
  using (auth.uid() = estudiante_id);

create policy "estudiante inserta inventos"
  on public.inventos for insert
  with check (auth.uid() = estudiante_id);

-- Misiones de Nivel 2 (visibles para todos)
alter table public.misiones enable row level security;
create policy "misiones publicas" on public.misiones for select using (true);

-- Insertar las misiones del Nivel 2
insert into public.misiones (numero, nivel, titulo, descripcion, xp_reward, elemento_planeta) values
  (1, 2, 'El Primer Mundo',         'Crea el escenario de tu videojuego', 80, 'continente'),
  (2, 2, 'El Gran Océano',          'Agrega fondos y música a tu juego',  80, 'oceano'),
  (3, 2, 'Vida en el Planeta',      'Añade personajes y movimiento',       80, 'arboles'),
  (4, 2, 'La Gran Ciudad',          'Crea niveles y obstáculos',           80, 'ciudad'),
  (5, 2, 'Energía Infinita',        'Agrega puntuación y efectos',         80, 'energia'),
  (6, 2, 'La Misión Secreta',       'Diseña el jefe final',                80, 'luna'),
  (7, 2, 'El Portal Dimensional',   'Conecta todos los niveles',           80, 'portal'),
  (8, 2, 'El Invento Completo',     'Presenta tu videojuego al mundo',    100, 'estrella');
