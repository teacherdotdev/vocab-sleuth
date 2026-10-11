import { readFileSync } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { PAGES, SITE_URL, type PageMeta } from './src/pageMeta'

// Adds the Cloudflare Web Analytics beacon to built pages. CF_BEACON_TOKEN is
// set only on the production Vercel environment, so dev servers, local builds
// and preview deploys don't count visits.
function cloudflareAnalytics(token: string | undefined): Plugin {
  return {
    name: 'cloudflare-analytics',
    apply: 'build',
    transformIndexHtml() {
      if (!token) return []
      return [
        {
          tag: 'script',
          attrs: {
            defer: true,
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': JSON.stringify({ token }),
          },
          injectTo: 'body',
        },
      ]
    },
  }
}

const INTRO_PATH = new URL('./src/content/intro.html', import.meta.url)
const HEAD_MARK = /<!-- seo:head -->[\s\S]*?<!-- \/seo:head -->/
const ROOT_MARK = /<div id="root">[\s\S]*?<!-- \/root -->\s*<\/div>/

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function jsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

function headTags(page: PageMeta, intro: string): string {
  const url = SITE_URL + page.path
  const title = escapeAttr(page.title)
  const description = escapeAttr(page.description)
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Vocab Sleuth" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Vocab Sleuth: a daily Wordle-style word game for the classroom" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (page.path === '/') {
    tags.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Vocab Sleuth',
        url: SITE_URL + '/',
        description: page.description,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
        educationalLevel: 'Grades 1-8',
        audience: { '@type': 'EducationalAudience', educationalRole: 'teacher' },
      }),
    )
    // The FAQ structured data is read from the visible FAQ in intro.html.
    const faqs = [...intro.matchAll(/<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/g)]
    tags.push(
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(([, q, a]) => ({
          '@type': 'Question',
          name: stripTags(q),
          acceptedAnswer: { '@type': 'Answer', text: stripTags(a) },
        })),
      }),
    )
  }
  return `<!-- seo:head -->\n    ${tags.join('\n    ')}\n    <!-- /seo:head -->`
}

// Gives crawlers real text and per-route metadata without SSR. index.html gets
// the home page's head tags plus the intro copy GamePage keeps in its "for
// teachers" drawer (here below a screen-tall spacer, so it stays off the
// first screen until the app takes over). At build
// time, every other route gets its own copy of index.html (words.html, ...)
// with its own head tags and an empty root; vercel.json's cleanUrls serves
// them at /words etc.
function seoPages(): Plugin {
  return {
    name: 'seo-pages',
    transformIndexHtml(html) {
      const intro = readFileSync(INTRO_PATH, 'utf8')
      return html
        .replace(HEAD_MARK, headTags(PAGES[0], intro))
        .replace(
          ROOT_MARK,
          `<div id="root">\n      <div class="min-h-screen"></div>\n      <div class="mx-auto max-w-3xl">\n      ${intro.trim()}\n      </div>\n      <!-- /root -->\n    </div>`,
        )
    },
    generateBundle: {
      // Runs after Vite has emitted the final index.html (with hashed assets).
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html']
        if (index?.type !== 'asset') return
        const html = String(index.source)
        const intro = readFileSync(INTRO_PATH, 'utf8')
        for (const page of PAGES.slice(1)) {
          this.emitFile({
            type: 'asset',
            fileName: `${page.path.slice(1)}.html`,
            source: html
              .replace(HEAD_MARK, headTags(page, intro))
              .replace(ROOT_MARK, '<div id="root"><!-- /root --></div>'),
          })
        }
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), seoPages(), cloudflareAnalytics(loadEnv(mode, process.cwd(), '').CF_BEACON_TOKEN)],
}))
