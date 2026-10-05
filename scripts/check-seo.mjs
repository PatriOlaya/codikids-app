import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { origin, pages } from '../src/marketing/content.js'
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
for (const [path, page] of Object.entries(pages)) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}/index.html`, 'utf8')
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + ': one H1')
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1)
  assert.ok(html.includes(`href="${origin}${path}"`), path + ': canonical')
  assert.ok(html.includes(page.title.replaceAll('&', '&amp;')), path + ': title')
  assert.ok(!html.includes('cercia.co'))
  assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`))
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.ok(schema['@graph'].some(x => x['@type'] === 'WebPage'))
  if (path.includes('/blog/')) assert.ok(schema['@graph'].some(x => x['@type'] === 'BlogPosting'))
  if (path === '/curso-scratch-para-ninos') assert.equal(schema['@graph'].filter(x => x['@type'] === 'Course').length, 3)
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (href === '/entrar' || href.startsWith('/assets/') || href.endsWith('.svg')) continue
    assert.ok(pages[href], path + ': broken internal link ' + href)
  }
}
assert.ok((await readFile('dist/app.html', 'utf8')).includes('noindex, nofollow'))
assert.ok((await readFile('dist/404.html', 'utf8')).includes('noindex, follow'))
console.log('SEO checks passed: 7 routes, metadata, schema, sitemap, links, private shell and 404.')
