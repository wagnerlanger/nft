import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '../public')

const BACKGROUND = '#140d0a'
const FOREGROUND = '#f5ebe0'

function markSvg(size, { safeArea = 1 } = {}) {
  const fontSize = Math.round(size * 0.52 * safeArea)
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BACKGROUND}"/>
  <text
    x="50%"
    y="52%"
    fill="${FOREGROUND}"
    font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    font-size="${fontSize}"
    font-weight="700"
    text-anchor="middle"
    dominant-baseline="middle"
  >K</text>
</svg>`,
  )
}

async function writePng(filename, size, options) {
  const outPath = path.join(publicDir, filename)
  const png = await sharp(markSvg(size, options)).png().toBuffer()
  await writeFile(outPath, png)
  console.log(`wrote ${path.relative(process.cwd(), outPath)} (${size}x${size})`)
}

await writePng('pwa-192x192.png', 192)
await writePng('pwa-512x512.png', 512)
await writePng('pwa-512x512-maskable.png', 512, { safeArea: 0.8 })
await writePng('apple-touch-icon.png', 180)

console.log('PWA icons ready.')
