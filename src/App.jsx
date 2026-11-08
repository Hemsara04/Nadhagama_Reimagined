import { useState } from 'react'
import useSmoothScroll from './hooks/useSmoothScroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Upcoming from './components/Upcoming'
import Story from './components/Story'
import Scenes from './components/Scenes'
import Village from './components/Village'
import Editions from './components/Editions'
import Finale from './components/Finale'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  useSmoothScroll(ready)

  return (
    <>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Upcoming />
        <Story />
        <Village />
        <Editions />
        <Scenes />
        <Finale />
      </main>
      <Footer />
    </>
  )
}
