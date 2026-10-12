# vocab-sleuth

A Wordle-style classroom game whose answer pool is restricted to a user-selected
grade band (1-2, 3-4, 5-8, 9-12). Single-page React + Vite + Tailwind app — no
backend, no accounts, no tracking. The daily word is the same for everyone in a
given grade.

## Getting started

```sh
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc -b && vite build` — type errors fail the build |
| `npm run lint` | ESLint (flat config in `eslint.config.js`) |
| `npm run preview` | Preview the production build |
| `npm run generate-words` | Regenerate `src/data/grades-*.json` and `src/data/guesses-*.json` |

There is no test suite.

## How it works

- **Routing**: a tiny hash-route hook (`src/hooks/useHashRoute.ts`) — no router
  library. `#/words` → word list; `#/about`, `#/privacy` → static pages;
  anything else → the game.
- **Game state**: `src/hooks/useWordleGame.ts` owns all game state for the
  current grade.
- **Daily answer**: `src/lib/dailyWord.ts` hashes `${YYYY-MM-DD}|${gradeId}`
  with cyrb53 and indexes into the grade's word list. Same date + same grade =
  same word for everyone.
- **Persistence**: `src/lib/storage.ts` saves progress in `localStorage` keyed
  by grade and day. Only today's game is loaded; switching grades is a
  separate saved game.
- **Two word pools per length**: `grades-*.json` is the small curated *answer*
  pool; `guesses-*.json` is the much larger *valid-guess* pool. Any answer is
  always a legal guess.

## Word data

`src/data/grades-*.json` and `src/data/guesses-*.json` are **generated** by
`scripts/generate-word-lists.mjs` from SUBTLEX-US frequencies, the Dale-Chall
familiar-word list, and a full English dictionary, with profanity filtered out.
Don't edit the JSON by hand — edit the script (or `scripts/data/blocklist.txt`)
and re-run `npm run generate-words`. See `src/data/README.md` for the
bucketing rules.

Duncan did not follow this and there were some manual deletions from the current
lists of words and guesses.

## Project layout

```
src/
  App.tsx            hash router
  pages/             GamePage, WordListPage, AboutPage, PrivacyPage
  components/        Board, Cell, Keyboard, Header, GradeModal, EndBanner
  hooks/             useWordleGame, useHashRoute
  lib/               dailyWord, grades, guesses, scoring, storage
  data/              generated word lists (see src/data/README.md)
scripts/             word-list generator + source data
```

## License

[Apache-2.0](LICENSE)
