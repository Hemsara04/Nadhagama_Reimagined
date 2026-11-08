import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PORTAL_URL } from '../data'
import Magnetic from './Magnetic'
import { asset } from '../asset'

const LINKS = [
  ['Festival', '#festival'],
  ['Story', '#story'],
  ['Artists', '#artists'],
  ['Editions', '#editions'],
  ['Scenes', '#scenes'],
]

export default function Nav({ ready }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const openRef = useRef(open)

  useEffect(() => {
    if (!ready) return
    const intro = gsap.fromTo(ref.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.6 })
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      ref.current?.classList.toggle('is-hidden', y > last && y > 600 && !openRef.current)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      intro.kill()
      window.removeEventListener('scroll', onScroll)
    }
  }, [ready])

  useEffect(() => {
    openRef.current = open
    if (open) window.__lenis?.stop()
    else if (!document.documentElement.dataset.heroLock) window.__lenis?.start()
  }, [open])

  return (
    <header ref={ref} className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <a href="#top" className="nav__logo" aria-label="Naadha Gama home">
        <img src={asset('/site/logo-white.png')} alt="Naadha Gama" />
      </a>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map(([label, href]) => (
          <a key={href} href={href} className="nav__link">
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <div className="nav__actions">
        <Magnetic>
          <a href={PORTAL_URL} className="pill pill--ghost" target="_blank" rel="noreferrer">
            <TicketIcon /> Portal
          </a>
        </Magnetic>
        <button className="nav__burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
        </button>
      </div>

      <div className="nav__sheet" onClick={() => setOpen(false)}>
        {LINKS.map(([label, href], i) => (
          <a key={href} href={href} style={{ '--i': i }}>
            <em>0{i + 1}</em>
            {label}
          </a>
        ))}
        <a href={PORTAL_URL} className="pill pill--gold" target="_blank" rel="noreferrer" style={{ '--i': LINKS.length }}>
          Pre Register
        </a>
      </div>
    </header>
  )
}

export function TicketIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
      <path d="M13 6v12" strokeDasharray="2 2" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}
