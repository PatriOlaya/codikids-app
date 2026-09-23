-- Ejecutar en SQL Editor del proyecto PLATAFORM CODIKIDS.
-- Se puede repetir: actualiza las misiones existentes por número y conserva sus IDs y progreso.
with mundos(numero, titulo, descripcion, xp_reward, elemento_planeta) as (values
 (1, 'Bosque de los Saltos', 'Crea a tu héroe y el primer tramo del juego. Programa caminar, saltar y caer con gravedad. Prueba: recorre el suelo y salta sin quedarse flotando.', 80, 'bosque'),
 (2, 'Islas Suspendidas', 'Dibuja plataformas de distintas alturas y programa aterrizajes y choques desde los lados. Prueba: salta entre plataformas sin atravesarlas ni pararse en el aire.', 80, 'islas'),
 (3, 'Cueva Espejo', 'Alarga el recorrido, mueve la cámara con suavidad y crea tres capas de fondo a distintas velocidades. Prueba: el fondo da profundidad sin sacudidas ni mareos.', 80, 'cueva'),
 (4, 'Desierto Eléctrico', 'Inventa una trampa y un enemigo; programa vidas, daño y unos segundos de protección. Prueba: al tocar el peligro pierde una sola vida y sigue jugando.', 80, 'desierto'),
 (5, 'Ciudad de Poderes', 'Crea un poder temporal de velocidad o salto y una meta que se abre al recoger objetos. Prueba: el poder termina a tiempo y la meta exige los objetos.', 80, 'ciudad_poderes'),
 (6, 'Castillo del Guardián', 'Diseña un jefe con patrón de movimiento, barra de vida y zonas claras para golpear. Prueba: se puede ganar o perder y cada golpe válido cuenta una sola vez.', 80, 'castillo'),
 (7, 'Portal de Control', 'Añade pausa, instrucciones, sonidos y controles táctiles si quieres jugar en celular. Prueba: se puede pausar, reanudar y terminar sin controles rotos.', 80, 'portal_control'),
 (8, 'Gran Estreno', 'Prueba el juego completo con otra persona. Corrige fallos, crea portada y publica tu versión final. Prueba: comparte el juego y explica tres decisiones de programación.', 100, 'estreno')
)
update public.misiones m set titulo = w.titulo, descripcion = w.descripcion, xp_reward = w.xp_reward, elemento_planeta = w.elemento_planeta
from mundos w where m.nivel = 3 and m.numero = w.numero;

with mundos(numero, titulo, descripcion, xp_reward, elemento_planeta) as (values
 (1, 'Bosque de los Saltos', 'Crea a tu héroe y el primer tramo del juego. Programa caminar, saltar y caer con gravedad. Prueba: recorre el suelo y salta sin quedarse flotando.', 80, 'bosque'),
 (2, 'Islas Suspendidas', 'Dibuja plataformas de distintas alturas y programa aterrizajes y choques desde los lados. Prueba: salta entre plataformas sin atravesarlas ni pararse en el aire.', 80, 'islas'),
 (3, 'Cueva Espejo', 'Alarga el recorrido, mueve la cámara con suavidad y crea tres capas de fondo a distintas velocidades. Prueba: el fondo da profundidad sin sacudidas ni mareos.', 80, 'cueva'),
 (4, 'Desierto Eléctrico', 'Inventa una trampa y un enemigo; programa vidas, daño y unos segundos de protección. Prueba: al tocar el peligro pierde una sola vida y sigue jugando.', 80, 'desierto'),
 (5, 'Ciudad de Poderes', 'Crea un poder temporal de velocidad o salto y una meta que se abre al recoger objetos. Prueba: el poder termina a tiempo y la meta exige los objetos.', 80, 'ciudad_poderes'),
 (6, 'Castillo del Guardián', 'Diseña un jefe con patrón de movimiento, barra de vida y zonas claras para golpear. Prueba: se puede ganar o perder y cada golpe válido cuenta una sola vez.', 80, 'castillo'),
 (7, 'Portal de Control', 'Añade pausa, instrucciones, sonidos y controles táctiles si quieres jugar en celular. Prueba: se puede pausar, reanudar y terminar sin controles rotos.', 80, 'portal_control'),
 (8, 'Gran Estreno', 'Prueba el juego completo con otra persona. Corrige fallos, crea portada y publica tu versión final. Prueba: comparte el juego y explica tres decisiones de programación.', 100, 'estreno')
)
insert into public.misiones (numero, nivel, titulo, descripcion, xp_reward, elemento_planeta)
select w.numero, 3, w.titulo, w.descripcion, w.xp_reward, w.elemento_planeta from mundos w
where not exists (select 1 from public.misiones m where m.nivel = 3 and m.numero = w.numero);
