import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { GradeId, GradeMeta } from '../types'
import { GRADES, getGrade } from '../lib/grades'
import { loadSelectedGrade, saveSelectedGrade } from '../lib/storage'
import { useWordleGame } from '../hooks/useWordleGame'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { GradeModal } from '../components/GradeModal'
import { Board } from '../components/Board'
import { Keyboard } from '../components/Keyboard'
import { EndBanner } from '../components/EndBanner'
import { navigate } from '../hooks/useRoute'
import introHtml from '../content/intro.html?raw'

export function GamePage() {
  const [gradeId, setGradeId] = useState<GradeId | null>(() => loadSelectedGrade())
  const [modalOpen, setModalOpen] = useState(() => loadSelectedGrade() === null)

  const grade = gradeId ? getGrade(gradeId) : null

  const handleSelect = (id: GradeId) => {
    setGradeId(id)
    saveSelectedGrade(id)
    setModalOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header rightLink={{ href: '/words', label: 'Word Lists' }} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-4 py-6">
        {grade ? (
          <GameBody
            key={grade.id}
            grade={grade}
            onChangeGrade={() => setModalOpen(true)}
          />
        ) : (
          <GamePreview />
        )}
      </main>
      <GradeModal
        open={modalOpen}
        onSelect={handleSelect}
        onClose={gradeId ? () => setModalOpen(false) : undefined}
        currentGrade={gradeId}
      />
      <Footer>
        <Intro />
      </Footer>
    </div>
  )
}

// Crawler-readable description of the game, in a drawer opened from the
// footer's "for teachers" link (from the right on desktop, from the bottom on
// mobile) so the page is just the game. The drawer stays in the DOM while
// closed, only moved off screen, and the same file is baked into index.html at
// build time (see the seo-pages plugin in vite.config.ts).
function Intro() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [open])

  const close = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  // Keep typing inside the drawer away from the game's window keydown listener.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (e.key === 'Escape') close()
  }

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const link = (e.target as Element).closest('a')
    const href = link?.getAttribute('href')
    if (!href?.startsWith('/')) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    navigate(href)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="intro-drawer"
        className="text-sm text-slate-500 hover:text-amber-700"
      >
        for teachers
      </button>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        id="intro-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        tabIndex={-1}
        inert={!open}
        onKeyDown={onKeyDown}
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white text-left outline-none transition-transform duration-300 ease-out md:inset-y-0 md:left-auto md:max-h-none md:w-[28rem] md:rounded-none ${
          open ? 'translate-y-0 shadow-2xl md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'
        }`}
      >
        <div className="sticky top-0 flex justify-end bg-white px-3 pt-3">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
        <div onClick={onClick} dangerouslySetInnerHTML={{ __html: introHtml }} />
      </div>
    </>
  )
}

function GamePreview() {
  const wordLength = GRADES[0]?.list.wordLength ?? 5
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
        <span className="invisible">placeholder</span>
      </div>
      <Board
        wordLength={wordLength}
        guesses={[]}
        scoredGuesses={[]}
        currentGuess=""
        invalidShake={false}
      />
      <div className="h-6" aria-hidden="true" />
      <Keyboard keyStates={{}} onPress={() => {}} disabled />
    </>
  )
}

interface GameBodyProps {
  grade: GradeMeta
  onChangeGrade: () => void
}

function GameBody({ grade, onChangeGrade }: GameBodyProps) {
  const game = useWordleGame(grade)
  const canReset = game.guesses.length > 0 || game.currentGuess.length > 0

  if (!game.answer) {
    return (
      <p className="rounded-md bg-amber-50 px-4 py-3 text-sm text-slate-700 ring-1 ring-amber-200">
        No words configured for {grade.id} yet. Add some to{' '}
        <code className="font-mono">src/data/grades-{grade.id}.json</code>.
      </p>
    )
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600">
        <span>{grade.label}</span>
        <button
          type="button"
          onClick={onChangeGrade}
          className="rounded-md bg-white px-3 py-1.5 font-medium text-slate-800 ring-1 ring-slate-300 hover:bg-amber-50 hover:ring-amber-400"
        >
          Change grade
        </button>
        <button
          type="button"
          onClick={game.reset}
          disabled={!canReset}
          className="rounded-md bg-white px-3 py-1.5 font-medium text-slate-800 ring-1 ring-slate-300 hover:bg-amber-50 hover:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:ring-slate-300"
        >
          Reset
        </button>
      </div>
      <Board
        wordLength={game.wordLength}
        guesses={game.guesses}
        scoredGuesses={game.scoredGuesses}
        currentGuess={game.currentGuess}
        invalidShake={game.invalidShake}
      />
      <div className="h-6 text-sm font-medium text-amber-700" aria-live="polite">
        {game.error}
      </div>
      <EndBanner status={game.status} answer={game.answer} />
      <Keyboard
        keyStates={game.keyStates}
        onPress={game.press}
        disabled={game.status !== 'playing'}
      />
    </>
  )
}
