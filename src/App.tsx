import { useEffect } from 'react'
import { useRoute } from './hooks/useRoute'
import { pageMeta } from './pageMeta'
import { GamePage } from './pages/GamePage'
import { WordListPage } from './pages/WordListPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'

function App() {
  const route = useRoute()
  useEffect(() => {
    document.title = pageMeta(route).title
  }, [route])
  if (route === '/words') return <WordListPage />
  if (route === '/about') return <AboutPage />
  if (route === '/privacy') return <PrivacyPage />
  return <GamePage />
}

export default App
