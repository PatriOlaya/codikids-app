import { StrictMode, lazy, Suspense } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import PublicSite from './marketing/PublicSite.jsx'
import { pages } from './marketing/content'
// Recover once when a deployment replaces a lazily loaded JS chunk.
const CHUNK_RELOAD_KEY = 'codikids-chunk-reload'
window.addEventListener('vite:preloadError', event => {
  event.preventDefault()
  const lastAttempt = Number(sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0)
  if (Date.now() - lastAttempt > 60000) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
    window.location.reload()
  } else {
    document.getElementById('root')?.replaceChildren()
    const message = document.createElement('div')
    message.style.cssText = 'min-height:100vh;display:grid;place-content:center;text-align:center;padding:24px;background:#1a1036;color:white;font:16px system-ui'
    const title = document.createElement('h1')
    title.textContent = 'No se pudo cargar CodiKids'
    const detail = document.createElement('p')
    detail.textContent = 'Hay una nueva versión disponible. Actualiza la página para continuar.'
    const button = document.createElement('button')
    button.textContent = 'Actualizar ahora'
    button.style.cssText = 'padding:12px 20px;border:0;border-radius:12px;background:#8df4dc;color:#15223b;font-weight:bold;cursor:pointer'
    button.addEventListener('click', () => window.location.reload())
    message.append(title, detail, button)
    document.getElementById('root')?.appendChild(message)
  }
})
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
