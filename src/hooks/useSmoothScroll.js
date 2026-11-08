import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
export default function useSmoothScroll(enabled) {
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !enabled)
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // no smooth scroll, but in-page links still need to release the locked hero first
      const onNativeClick = (e) => e.target.closest('a[href^="#"]') && window.__unlockHero?.()
      document.addEventListener('click', onNativeClick, true)
      return () => document.removeEventListener('click', onNativeClick, true)
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    // The hero may already be holding the page still before Lenis exists
    if (document.documentElement.dataset.heroLock) lenis.stop()
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const target = document.querySelector(a.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      window.__unlockHero?.()
      lenis.scrollTo(target, { offset: -20, duration: 1.6, force: true })
    }
    document.addEventListener('click', onClick)
    ScrollTrigger.refresh()

    // Lazy images and web fonts change section heights after first paint; re-measure the
    // scroll animations (pins especially) so they start and end in the right place.
    let t
    const refreshSoon = () => {
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 200)
    }
    const onAssetLoad = (e) => e.target.tagName === 'IMG' && refreshSoon()
    document.addEventListener('load', onAssetLoad, true) // img load doesn't bubble; capture does
    window.addEventListener('load', refreshSoon)
    document.fonts?.ready.then(refreshSoon)

    return () => {
      clearTimeout(t)
      document.removeEventListener('load', onAssetLoad, true)
      window.removeEventListener('load', refreshSoon)
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.__lenis = null
    }
  }, [enabled])
}
