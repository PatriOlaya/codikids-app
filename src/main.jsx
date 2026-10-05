import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import PublicSite from './marketing/PublicSite.jsx'
import { pages } from './marketing/content'
const App = lazy(() => import('./App.jsx'))
const path = window.location.pathname.replace(/\/$/, '') || '/'
const privateRoute = /^\/(entrar|admin|laboratorio)(\/|$)|^\/padre\//.test(path)
if (privateRoute) {
  document.title = 'Acceso privado | CODIKIDS'
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
  robots.content = 'noindex, nofollow'
}
const content = <StrictMode>{privateRoute ? <Suspense fallback={<div className="app-loading" role="status">Cargando CODIKIDS…</div>}><App/></Suspense> : <PublicSite path={path}/>}</StrictMode>
const root = document.getElementById('root')
if (!privateRoute && root.hasChildNodes()) hydrateRoot(root, content)
else createRoot(root).render(content)
if (import.meta.env.DEV && pages[path]) document.title = pages[path].title
