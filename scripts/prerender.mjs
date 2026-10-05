import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { origin, pages, levels, faq, articles } from '../src/marketing/content.js'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const organization = { '@type': 'EducationalOrganization', '@id': origin + '/#organization', name: 'CODIKIDS', url: origin + '/', logo: origin + '/favicon.svg', telephone: '+573193579832', email: 'codikidspro@gmail.com', address: { '@type': 'PostalAddress', addressLocality: 'Ibagué', addressRegion: 'Tolima', addressCountry: 'CO' } }
try {
  const { default: PublicSite } = await server.ssrLoadModule('/src/marketing/PublicSite.jsx')
  const template = await readFile('dist/index.html', 'utf8')
  await writeFile('dist/app.html', template.replace('<!-- seo-head -->', '<title>Acceso privado | CODIKIDS</title><meta name="robots" content="noindex, nofollow">'))
  for (const path of [...Object.keys(pages), '/404']) {
    const page = pages[path] || { title: 'Página no encontrada | CODIKIDS', description: 'Esta página no existe. Visita los cursos y guías de CODIKIDS.' }
    const url = origin + path
    const article = articles.find(a => path === '/blog/' + a.slug)
    const graph = [organization, { '@type': 'WebPage', '@id': url + '#webpage', url, name: page.title, description: page.description, inLanguage: 'es-CO', publisher: { '@id': organization['@id'] } }]
    if (path !== '/' && path !== '/404') graph.push({ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Inicio', item: origin + '/' }, ...(article ? [{ '@type': 'ListItem', position: 2, name: 'Blog', item: origin + '/blog' }] : []), { '@type': 'ListItem', position: article ? 3 : 2, name: page.title.split(' | ')[0], item: url }] })
    if (path === '/curso-scratch-para-ninos') {
      graph.push(...levels.map(([name, intro, topics]) => ({ '@type': 'Course', name: 'Scratch ' + name, description: intro + '. ' + topics, url, provider: { '@id': organization['@id'] }, inLanguage: 'es', educationalLevel: name, hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT6H' } })))
      graph.push({ '@type': 'FAQPage', mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) })
    }
    if (article) graph.push({ '@type': 'BlogPosting', headline: article.title, description: article.description, mainEntityOfPage: url, datePublished: '2026-10-05', dateModified: '2026-10-05', author: { '@id': organization['@id'] }, publisher: { '@id': organization['@id'] }, image: origin + '/og-image.jpg', inLanguage: 'es-CO' })
    const head = `<title>${escape(page.title)}</title>\n<meta name="description" content="${escape(page.description)}">\n<meta name="robots" content="${path === '/404' ? 'noindex, follow' : 'index, follow'}">\n<link rel="canonical" href="${url}">\n<meta property="og:type" content="${article ? 'article' : 'website'}">\n<meta property="og:url" content="${url}">\n<meta property="og:title" content="${escape(page.title)}">\n<meta property="og:description" content="${escape(page.description)}">\n<meta property="og:image" content="${origin}/og-image.jpg">\n<meta property="og:image:alt" content="CODIKIDS, programación para niños">\n<meta property="og:locale" content="es_CO">\n<meta property="og:site_name" content="CODIKIDS">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${escape(page.title)}">\n<meta name="twitter:description" content="${escape(page.description)}">\n<meta name="twitter:image" content="${origin}/og-image.jpg">\n<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>`
    const html = template.replace('<!-- seo-head -->', head).replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(PublicSite, { path }))}</div>`)
    const dir = path === '/' ? 'dist' : path === '/404' ? 'dist' : 'dist' + path
    await mkdir(dir, { recursive: true })
    await writeFile(path === '/404' ? 'dist/404.html' : dir + '/index.html', html)
  }
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`)
  console.log('Prerendered 7 public routes and 404; sitemap generated.')
} finally { await server.close() }
