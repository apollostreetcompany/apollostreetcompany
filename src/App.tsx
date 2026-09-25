import { Approach } from '@/components/Approach'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { HowWeWork } from '@/components/HowWeWork'
import { Nav } from '@/components/Nav'
import { Projects } from '@/components/Projects'
import { useEffect } from 'react'
import { LangProvider } from '@/lib/i18n'

export default function App() {
  // Sections render after the browser's own hash jump, so honour deep links like /#works here.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <LangProvider>
      <Nav />
      <main>
        <Hero />
        <Approach />
        <HowWeWork />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </LangProvider>
  )
}
