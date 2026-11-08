import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FESTIVAL, PORTAL_URL } from '../data'
import Magnetic from './Magnetic'
import { ArrowIcon } from './Nav'
import { asset } from '../asset'

// Centre of the round 360° stage in both photos (fractions of the viewport).
const STAGE = { x: 0.5, y: 0.6 }

export default function Hero({ ready }) {
  const root = useRef(null)

  // Scroll-locked hero: the first scroll gesture opens a 360° iris from the stage into the celebration
  // photo, then the wording rises at the bottom. Only the next gesture releases the page to scroll.
  useGSAP(
    () => {
      if (!ready) return
      const el = root.current
      const html = document.documentElement
      const imgB = el.querySelector('.hero__img--b')
      const ring = el.querySelector('.hero__ring')

      const iris = { p: 0 }
      const paint = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        const cx = w * STAGE.x
        const cy = h * STAGE.y
        const r = iris.p * (Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 40)
        imgB.style.clipPath = `circle(${r}px at ${cx}px ${cy}px)`
        gsap.set(ring, { width: r * 2, height: r * 2, x: cx - r, y: cy - r })
      }
      paint()
      window.addEventListener('resize', paint)

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const reveal = gsap
        .timeline({ paused: true })
        .to('.hero__prompt', { opacity: 0, y: 16, duration: 0.4, ease: 'power2.in' }, 0)
        .to('.hero__img--a', { scale: 1.5, rotate: -14, filter: 'brightness(0.3) blur(6px)', duration: 2.1, ease: 'power3.inOut' }, 0)
        .fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.2)
        .to(iris, { p: 1, duration: reduce ? 0.01 : 1.9, ease: 'expo.inOut', onUpdate: paint }, 0.2)
        .fromTo('.hero__img--b', { opacity: reduce ? 0 : 1 }, { opacity: 1, duration: 0.8 }, 0.2)
        .fromTo('.hero__img--b', { scale: 1.4, rotate: 12 }, { scale: 1.06, rotate: 0, duration: 2.2, ease: 'expo.out' }, 0.25)
        .to(ring, { opacity: 0, duration: 0.5 }, 1.75)
        // wording loads once the celebration photo is fully open
        .addLabel('words', 2.0)
        .fromTo('.hero__shade--bottom', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 'words')
        .fromTo('.hero__logo', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'expo.inOut' }, 'words')
        .fromTo('.hero__tag .line > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.1, duration: 1, ease: 'expo.out' }, 'words+=0.35')
        .fromTo('.hero__meta > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, ease: 'expo.out' }, 'words+=0.5')
        .fromTo('.hero__rule', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 'words+=0.2')
        .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 'words+=1')

      // Intro once the loader lifts
      const intro = gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo('.hero__img--a', { scale: 1.3, filter: 'brightness(0.15) blur(0px)' }, { scale: 1.08, filter: 'brightness(0.85) blur(0px)', duration: 2.6 })
        .fromTo('.hero__prompt', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 1)

      // Gentle parallax on the first photo while waiting for the gesture
      const px = gsap.quickTo('.hero__parallax', 'x', { duration: 1.2, ease: 'power3' })
      const py = gsap.quickTo('.hero__parallax', 'y', { duration: 1.2, ease: 'power3' })
      const onMove = (e) => {
        px((e.clientX / innerWidth - 0.5) * -24)
        py((e.clientY / innerHeight - 0.5) * -16)
      }
      window.addEventListener('pointermove', onMove)

      // ---- Scroll lock --------------------------------------------------------------
      // While locked, wheel / touch / keys never move the page; they only drive the photo swap.
      // Once the wording has fully loaded (plus a short settle so the first swipe's momentum is
      // spent), the next downward scroll releases the page and glides on to the next section.
      const GAP = 450 // ms of silence that separates one gesture from the next (used for rewinding)
      const SETTLE = 600 // ms after the wording finishes before a downward scroll may release
      let stage = 0 // 0: first photo, 1: celebration + wording, 2: released
      let locked = false
      let lastInput = -Infinity
      let releaseAfter = Infinity
      let touchY = null
      let touchUsed = false
      let killed = false
      let lastY = 0

      reveal.eventCallback('onComplete', () => (releaseAfter = performance.now() + SETTLE))

      const lock = () => {
        if (killed) return
        locked = true
        html.dataset.heroLock = '1'
        html.classList.add('hero-locked')
        window.__lenis?.stop()
        window.scrollTo(0, 0)
        lastY = 0
      }
      const release = (glide = false) => {
        stage = 2
        locked = false
        delete html.dataset.heroLock
        html.classList.remove('hero-locked')
        const lenis = window.__lenis
        lenis?.start()
        if (!glide) return
        // the releasing scroll carries straight on past the hero
        if (lenis) lenis.scrollTo(el.offsetHeight, { duration: 1.4, force: true })
        else window.scrollTo({ top: el.offsetHeight })
      }
      const intent = (dir, newGesture) => {
        if (!locked || reveal.isActive()) return
        if (dir > 0) {
          if (stage === 0) {
            stage = 1
            releaseAfter = Infinity
            intro.progress(1) // a gesture during the intro must not let it fade the prompt back in
            reveal.timeScale(1).play()
          } else if (stage === 1 && performance.now() > releaseAfter) release(true)
        } else if (stage === 1 && newGesture) {
          stage = 0
          reveal.timeScale(1.6).reverse()
        }
      }

      // Capture-phase handlers on window run before Lenis's own listeners; stopping propagation
      // keeps Lenis from smooth-scrolling the page while the hero is locked.
      const onWheel = (e) => {
        if (!locked) return
        e.preventDefault()
        e.stopPropagation()
        const now = performance.now()
        const newGesture = now - lastInput > GAP
        lastInput = now
        if (Math.abs(e.deltaY) < 4) return
        intent(Math.sign(e.deltaY), newGesture)
      }
      const onTouchStart = (e) => {
        touchY = e.touches[0].clientY
        touchUsed = false
      }
      const onTouchMove = (e) => {
        if (!locked) return
        e.preventDefault()
        e.stopPropagation()
        if (touchUsed || touchY === null) return
        const dy = touchY - e.touches[0].clientY
        if (Math.abs(dy) < 40) return
        touchUsed = true // one swipe = one step
        intent(Math.sign(dy), true)
      }
      const onKey = (e) => {
        if (!locked) return
        const down = ['ArrowDown', 'PageDown', ' ', 'End'].includes(e.key)
        const up = ['ArrowUp', 'PageUp', 'Home'].includes(e.key)
        if (!down && !up) return
        e.preventDefault()
        e.stopPropagation()
        intent(down ? 1 : -1, !e.repeat)
      }
      // Scrolled back to the very top: lock again so an upward gesture rewinds the photos.
      const onScroll = () => {
        // Safety net: nothing may move the page while locked (scrollbar drag, find-in-page, etc.)
        if (locked && window.scrollY > 0) {
          window.__lenis?.scrollTo(0, { immediate: true, force: true })
          window.scrollTo(0, 0)
          return
        }
        const y = window.scrollY
        const movingUp = y < lastY
        lastY = y
        if (stage === 2 && movingUp && y <= 2) {
          stage = 1
          lastInput = performance.now() // the gesture that brought us here must end first
          releaseAfter = performance.now() + SETTLE
          lock()
        }
      }

      const opts = { passive: false, capture: true }
      window.addEventListener('wheel', onWheel, opts)
      window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
      window.addEventListener('touchmove', onTouchMove, opts)
      window.addEventListener('keydown', onKey, true)
      window.addEventListener('scroll', onScroll, { passive: true })

      // Nav links skip straight past the hero
      window.__unlockHero = () => {
        reveal.progress(1)
        if (stage !== 2) release()
      }

      // Lenis may not exist yet (it is created in the parent's effect); useSmoothScroll stops it
      // on creation while data-hero-lock is set, and the next-frame call covers a recreated instance.
      lock()
      const raf = requestAnimationFrame(lock)

      return () => {
        killed = true
        cancelAnimationFrame(raf)
        delete html.dataset.heroLock
        html.classList.remove('hero-locked')
        window.__unlockHero = null
        window.removeEventListener('wheel', onWheel, opts)
        window.removeEventListener('touchstart', onTouchStart, { capture: true })
        window.removeEventListener('touchmove', onTouchMove, opts)
        window.removeEventListener('keydown', onKey, true)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', paint)
        window.removeEventListener('pointermove', onMove)
      }
    },
    { scope: root, dependencies: [ready] },
  )

  return (
    <section id="top" className="hero" ref={root}>
      <div className="hero__parallax">
        <img className="hero__img hero__img--a" src={asset('/images/360.jpg')} alt="Naadha Gama 360° at the stadium — artists on the round stage" />
        <img
          className="hero__img hero__img--b"
          src={asset('/images/360_celebrating_all.jpg')}
          alt="The whole Naadha Gama 360° cast celebrating together on stage"
        />
      </div>
      <div className="hero__shade" />
      <div className="hero__shade hero__shade--bottom" />

      <div className="hero__ring" aria-hidden />

      <p className="hero__prompt" aria-hidden>
        <span>Scroll to begin</span>
        <i />
      </p>

      <div className="hero__words">
        <h1 className="sr-only">Naadha Gama — an enchanting musical journey from Sri Lanka</h1>
        <div className="hero__brand">
          <img className="hero__logo" src={asset('/site/logo-white.png')} alt="" />
          <p className="hero__tag">
            <span className="line">
              <span>An enchanting musical journey</span>
            </span>
            <span className="line">
              <span>
                from <em>Sri Lanka</em>
              </span>
            </span>
          </p>
        </div>
        <span className="hero__rule" aria-hidden />
        <div className="hero__meta">
          <p className="hero__when">
            <span>{FESTIVAL.place}</span>
            <em>{FESTIVAL.dates}</em>
          </p>
          <Magnetic>
            <a className="pill pill--gold" href={PORTAL_URL} target="_blank" rel="noreferrer" data-cursor="Join">
              Pre Register <ArrowIcon />
            </a>
          </Magnetic>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden>
        <span>Scroll to explore</span>
        <i />
      </div>
    </section>
  )
}
