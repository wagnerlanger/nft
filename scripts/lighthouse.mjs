import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const chromeLauncher = require('chrome-launcher')
const lighthouseModule = require('lighthouse')
const lighthouse = lighthouseModule.default ?? lighthouseModule

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'audits')
const PORT = 4177
const LOCAL_BASE = `http://127.0.0.1:${PORT}`
const PUBLISHED_BASE = 'https://nft.wagnerlanger.com'

const PAGES = [
  { name: 'home', path: '/' },
  // First fixture slug from seeds[0] — regenerated if fixtures change.
  { name: 'nft-detail', path: '/nfts/emerald-ape-042' },
]

const PROFILES = [
  { name: 'mobile', formFactor: 'mobile', screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2, disabled: false } },
  { name: 'desktop', formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } },
]

const ENVIRONMENTS = [
  {
    id: 'local',
    label: 'Local (vite preview)',
    baseUrl: LOCAL_BASE,
    startPreview: true,
  },
  {
    id: 'published',
    label: 'Publicado (Coolify)',
    baseUrl: PUBLISHED_BASE,
    startPreview: false,
  },
]

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function scoreOf(lhr, category) {
  return Math.round((lhr.categories[category]?.score ?? 0) * 100)
}

function metric(lhr, id) {
  return lhr.audits[id]?.numericValue ?? null
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url)
      if (response.ok || response.status === 404) return
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`Server did not respond at ${url}`)
}

async function runOnce(url, profile) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  })
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      formFactor: profile.formFactor,
      screenEmulation: profile.screenEmulation,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    })
    return result.lhr
  } finally {
    await chrome.kill()
  }
}

async function auditPages(envId, baseUrl) {
  const pages = {}

  for (const page of PAGES) {
    pages[page.name] = {}
    for (const profile of PROFILES) {
      const runs = []
      for (let i = 0; i < 3; i += 1) {
        const lhr = await runOnce(`${baseUrl}${page.path}`, profile)
        runs.push({
          performance: scoreOf(lhr, 'performance'),
          accessibility: scoreOf(lhr, 'accessibility'),
          bestPractices: scoreOf(lhr, 'best-practices'),
          seo: scoreOf(lhr, 'seo'),
          lcp: metric(lhr, 'largest-contentful-paint'),
          cls: metric(lhr, 'cumulative-layout-shift'),
          tbt: metric(lhr, 'total-blocking-time'),
        })
        await writeFile(
          path.join(outDir, `${envId}-${page.name}-${profile.name}-run${i + 1}.json`),
          JSON.stringify(lhr, null, 2),
        )
      }

      pages[page.name][profile.name] = {
        performance: median(runs.map((r) => r.performance)),
        accessibility: median(runs.map((r) => r.accessibility)),
        bestPractices: median(runs.map((r) => r.bestPractices)),
        seo: median(runs.map((r) => r.seo)),
        lcpMs: median(runs.map((r) => r.lcp ?? 0)),
        cls: median(runs.map((r) => r.cls ?? 0)),
        tbtMs: median(runs.map((r) => r.tbt ?? 0)),
        runs,
      }
    }
  }

  return pages
}

async function auditEnvironment({ id, label, baseUrl, startPreview }) {
  let preview = null

  if (startPreview) {
    preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT)], {
      cwd: root,
      stdio: 'ignore',
      shell: true,
    })
  }

  try {
    await waitForServer(baseUrl)
    const pages = await auditPages(id, baseUrl)
    return { label, baseUrl, pages }
  } finally {
    preview?.kill('SIGTERM')
  }
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const summary = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    environments: {},
  }

  for (const env of ENVIRONMENTS) {
    console.error(`Auditing ${env.id} (${env.baseUrl})…`)
    summary.environments[env.id] = await auditEnvironment(env)
  }

  await writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2))
  console.log(JSON.stringify(summary, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
