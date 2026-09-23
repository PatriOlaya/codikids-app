-- Ejecutar una sola vez en Supabase > SQL Editor del proyecto PLATAFORM CODIKIDS.
-- No modifica las misiones ni el progreso de niveles anteriores.
insert into public.misiones (numero, nivel, titulo, descripcion, xp_reward, elemento_planeta)
select v.numero, 3, v.titulo, v.descripcion, v.xp_reward, v.elemento_planeta
from (values
 (1, 'Mi héroe, mi mundo', 'Elige personaje y escenario. Construye en Scratch el suelo y programa caminar y saltar con gravedad y colisiones. Entregable: una escena jugable con movimiento estable.', 80, 'continente'),
 (2, 'Un mundo en movimiento', 'Diseña plataformas alcanzables y tres capas de fondo. Programa una cámara suave y parallax discreto. Entregable: recorrer el primer tramo sin atravesar plataformas.', 80, 'oceano'),
 (3, 'Primer desafío', 'Añade un obstáculo y un enemigo con comportamiento sencillo. Programa vidas, daño con tiempo de protección y reinicio. Entregable: superar el desafío y perder una vida correctamente.', 80, 'arboles'),
 (4, 'Poder especial', 'Diseña y programa un power-up de velocidad o salto, con duración visible y retorno al estado normal. Entregable: recoger, usar y agotar el poder.', 80, 'ciudad'),
 (5, 'La misión del jugador', 'Añade objetos coleccionables, marcador y meta. Programa condiciones para abrir el siguiente tramo. Entregable: lograr la meta jugando, sin activar atajos.', 80, 'energia'),
 (6, 'Duelo final', 'Diseña un jefe con patrón claro, zona de daño y barra de vida. Programa ataques, victoria y derrota. Entregable: un combate completo y justo.', 80, 'luna'),
 (7, 'Pulido profesional', 'Integra música, efectos, pausa, controles táctiles opcionales y correcciones de colisión y cámara. Entregable: juego estable en computador y prueba en móvil si aplica.', 80, 'portal'),
 (8, 'Estreno de mi juego', 'Prueba el juego completo, corrige errores, personaliza portada e instrucciones y comparte el proyecto. Entregable: juego final propio y presentación de sus decisiones de programación.', 100, 'estrella')
) as v(numero, titulo, descripcion, xp_reward, elemento_planeta)
where not exists (
  select 1 from public.misiones m where m.nivel = 3 and m.numero = v.numero
);
