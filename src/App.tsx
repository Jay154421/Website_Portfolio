import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Login from './pages/Login'
import Admin from './pages/Admin'
import SpeedType from './pages/SpeedType'
import NotFound from './pages/NotFound'
import { useRoute } from './lib/router'

const TITLES: Record<string, string> = {
  '/': 'Portfolio',
  '/login': 'Admin login',
  '/admin': 'Local dashboard',
  '/speedtype': 'Speed type',
}

function App() {
  const path = useRoute()
  const prevPath = useRef(path)

  useEffect(() => {
    // Skip the first run so deep links like /#projects keep their scroll position.
    if (prevPath.current !== path) window.scrollTo(0, 0)
    prevPath.current = path
    document.title = TITLES[path] ?? 'Page not found'
  }, [path])

  if (path === '/login') return <Login />
  if (path === '/admin') return <Admin />
  if (path === '/speedtype') return <SpeedType />
  if (path !== '/') return <NotFound />

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        {/* <Experience /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
