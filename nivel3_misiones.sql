-- Ejecutar en SQL Editor del proyecto PLATAFORM CODIKIDS.
-- Se puede repetir: actualiza las misiones existentes por número y conserva sus IDs y progreso.
with mundos(numero, titulo, descripcion, xp_reward, elemento_planeta) as (values
 (1, 'Bosque de los Saltos', 'Programa el salto vertical del gato y la gravedad.', 80, 'bosque'),
 (2, 'Sendero del Movimiento', 'Añade controles horizontales al mismo juego.', 80, 'sendero'),
 (3, 'Islas Suspendidas', 'Añade plataformas y aterrizajes sin atravesarlas.', 80, 'islas'),
 (4, 'Cueva Espejo', 'Agrega cámara que sigue al gato y fondo con desplazamiento.', 80, 'cueva'),
 (5, 'Desierto Eléctrico', 'Agrega peligros, vidas y protección temporal.', 80, 'desierto'),
 (6, 'Ciudad de Poderes', 'Agrega una estrella que da un poder temporal de salto.', 80, 'ciudad_poderes'),
 (7, 'Castillo del Guardián', 'Vence al guardián aterrizando sobre él.', 80, 'castillo'),
 (8, 'Gran Estreno', 'Prueba el juego completo, pausa y alcanza la meta.', 100, 'estreno')
)
update public.misiones m set titulo = w.titulo, descripcion = w.descripcion, xp_reward = w.xp_reward, elemento_planeta = w.elemento_planeta
from mundos w where m.nivel = 3 and m.numero = w.numero;

with mundos(numero, titulo, descripcion, xp_reward, elemento_planeta) as (values
 (1, 'Bosque de los Saltos', 'Programa el salto vertical del gato y la gravedad.', 80, 'bosque'),
 (2, 'Sendero del Movimiento', 'Añade controles horizontales al mismo juego.', 80, 'sendero'),
 (3, 'Islas Suspendidas', 'Añade plataformas y aterrizajes sin atravesarlas.', 80, 'islas'),
 (4, 'Cueva Espejo', 'Agrega cámara que sigue al gato y fondo con desplazamiento.', 80, 'cueva'),
 (5, 'Desierto Eléctrico', 'Agrega peligros, vidas y protección temporal.', 80, 'desierto'),
 (6, 'Ciudad de Poderes', 'Agrega una estrella que da un poder temporal de salto.', 80, 'ciudad_poderes'),
 (7, 'Castillo del Guardián', 'Vence al guardián aterrizando sobre él.', 80, 'castillo'),
 (8, 'Gran Estreno', 'Prueba el juego completo, pausa y alcanza la meta.', 100, 'estreno')
)
insert into public.misiones (numero, nivel, titulo, descripcion, xp_reward, elemento_planeta)
select w.numero, 3, w.titulo, w.descripcion, w.xp_reward, w.elemento_planeta from mundos w
where not exists (select 1 from public.misiones m where m.nivel = 3 and m.numero = w.numero);
