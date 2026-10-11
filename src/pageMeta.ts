// Per-route <title> and description. Used at build time by the seo-pages
// plugin in vite.config.ts (which writes one HTML file per route) and at
// runtime by App to keep document.title in sync during client navigation.

export const SITE_URL = 'https://www.vocabsleuth.com'

export interface PageMeta {
  path: string
  title: string
  description: string
}

export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'Vocab Sleuth: Free Wordle-Style Word Game for Classrooms',
    description:
      'A free daily Wordle-style word game for grades 1–8. Students guess a grade-appropriate mystery word in six tries. No accounts, no ads.',
  },
  {
    path: '/words',
    title: 'Word Lists by Grade | Vocab Sleuth',
    description:
      'Every answer word in Vocab Sleuth, sorted by grade band: four-letter words for grades 1–2 and 3–4, five-letter words for grades 4–8.',
  },
  {
    path: '/about',
    title: 'About Vocab Sleuth and the EdTech-a-thon',
    description:
      'Vocab Sleuth is a free classroom word game from the EdTech-a-thon, a community building free tools for teachers. No paywalls, no ads, no tracking.',
  },
  {
    path: '/privacy',
    title: 'Vocab Sleuth Privacy: No Personal Data Collected',
    description:
      'Vocab Sleuth collects no personal information. Progress stays in your browser, and visits are counted anonymously with cookieless analytics.',
  },
]

export function pageMeta(path: string): PageMeta {
  return PAGES.find((p) => p.path === path) ?? PAGES[0]
}
