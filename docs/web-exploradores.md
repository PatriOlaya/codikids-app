# CodiKids Web Exploradores — implementación inicial
Rama de trabajo: feature/web-exploradores.
1. Ejecutar migrations/20261116_web_exploradores.sql en Supabase SQL Editor.
2. Matricular estudiantes con UUID de auth.users; activar=true y clases_habilitadas=1..8.
3. La ruta /web-exploradores exige sesión y consulta la matrícula; las políticas RLS impiden leer/escribir proyectos sin matrícula activa.
4. No desplegar a producción sin probar autenticación, RLS, permisos de administradora, editor, guardado y protección de HTML.
5. Editor: vista visual para clases 1-3, HTML desde 4, CSS desde 5; vista previa en iframe sandbox sin permisos.
Pendiente: panel administrativo de matrícula, contenidos guiados completos por clase, validación de HTML, pruebas automatizadas y publicación supervisada.