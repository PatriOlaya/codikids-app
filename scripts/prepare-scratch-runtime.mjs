import { copyFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
const require = createRequire(import.meta.url)
const root = dirname(require.resolve('@turbowarp/packager/package.json'))
const dest = new URL('../public/scratch/', import.meta.url)
await mkdir(dest, { recursive: true })
await copyFile(resolve(root, 'dist/scaffolding/scaffolding-min.js'), new URL('runtime.js', dest))
await copyFile(resolve(root, 'dist/scaffolding/scaffolding-min.js.LICENSE.txt'), new URL('runtime.NOTICES.txt', dest))
await copyFile(resolve(root, 'LICENSE'), new URL('runtime.LICENSE.txt', dest))
