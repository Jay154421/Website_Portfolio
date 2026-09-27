import { useEffect, useRef } from 'react'
import Navbar from '@/shared/layout/Navbar'
import Hero from '@/features/portfolio/Hero'
import About from '@/features/portfolio/About'
import Skills from '@/features/portfolio/Skills'
import Projects from '@/features/portfolio/Projects'
import Contact from '@/features/portfolio/Contact'
import Footer from '@/shared/layout/Footer'
import Login from '@/features/auth/Login'
import Admin from '@/features/admin/Admin'
import SpeedType from '@/features/speedtype/SpeedType'
import NotFound from '@/pages/NotFound'
import { useRoute } from '@/shared/lib/router'

const TITLES: Record<string, string> = {
  '/': 'Portfolio',
  '/login': 'Admin login',
  '/admin': 'Local dashboard',
  '/admin/runs': 'Local dashboard runs',
  '/admin/session': 'Local dashboard session',
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
  if (path === '/admin' || path === '/admin/runs' || path === '/admin/session') return <Admin />
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
