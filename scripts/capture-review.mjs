import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

const OUT = ".impeccable/review"
mkdirSync(OUT, { recursive: true })

const BASE = "http://localhost:3000"
const PROJECT_ID = "skynet-1794483253131"

// The homepage redirects to /dashboard when a session cookie exists, so it must
// be captured in a logged-out context.
const LOGGED_OUT_PAGES = [{ slug: "home", url: "/" }]

const LOGGED_IN_PAGES = [
  { slug: "login", url: "/login" },
  { slug: "dashboard", url: "/dashboard" },
  { slug: "project", url: `/projects/${PROJECT_ID}` },
]

const browser = await chromium.launch({
  executablePath: `${process.env.HOME}/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome`,
})

async function capture(width, height, suffix, pages, authed) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  if (authed) {
    await page.goto(`${BASE}/login`, { waitUntil: "networkidle" })
    await page.evaluate(async () => {
      await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: "demo@skynet.app",
          password: "password123",
        }),
      })
    })
  }

  for (const p of pages) {
    await page.goto(`${BASE}${p.url}`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1500)
    const file = `${OUT}/${p.slug}-${suffix}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`captured ${file}`)
  }
  await context.close()
}

// Desktop (1440) and mobile (390) passes.
await capture(1440, 900, "desktop", LOGGED_OUT_PAGES, false)
await capture(390, 844, "mobile", LOGGED_OUT_PAGES, false)
await capture(1440, 900, "desktop", LOGGED_IN_PAGES, true)
await capture(390, 844, "mobile", LOGGED_IN_PAGES, true)

await browser.close()
console.log("done")
