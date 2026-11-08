import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import useInView from '../hooks/useInView'
import { ARTISTS } from '../data'

const HillsScene = lazy(() => import('./HillsScene'))

export default function Village() {
  const root = useRef(null)
  const progress = useRef(0)
  const [mounted, setMounted] = useState(false)
  const inView = useInView(root)

  // only mount the WebGL scene once it's near the viewport
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setMounted(true), { rootMargin: '400px' })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const splits = []
      const title = SplitText.create('.village__title', { type: 'chars, words', charsClass: 'c' })
      splits.push(title)
      gsap.from(title.chars, {
        yPercent: 100,
        opacity: 0,
        rotateX: -80,
        stagger: 0.025,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.village__title', start: 'top 80%' },
      })

      gsap.utils.toArray('.artist').forEach((row) => {
        const frame = row.querySelector('.artist__frame')
        const img = row.querySelector('img')
        const fromLeft = row.classList.contains('artist--flip')
        const name = SplitText.create(row.querySelector('.artist__name'), { type: 'chars, words', charsClass: 'c' })
        splits.push(name)

        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 75%' } })
          .from(frame, {
            clipPath: fromLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
            duration: 1.6,
            ease: 'expo.inOut',
          })
          .from(img, { scale: 1.35, duration: 2.2, ease: 'expo.out' }, 0.2)
          .from(name.chars, { yPercent: 110, opacity: 0, stagger: 0.035, duration: 1.1, ease: 'expo.out' }, 0.6)
          .from(row.querySelector('.artist__rule'), { scaleX: 0, duration: 1.2, ease: 'expo.inOut' }, 0.8)
          .from(row.querySelector('.artist__role'), { y: 16, opacity: 0, duration: 0.9, ease: 'expo.out' }, 1)

        // slow drift across the frame while the row scrolls by (the zoom is anchored on the artist's face)
        gsap.set(img, { transformOrigin: img.style.objectPosition || '50% 30%' })
        gsap.fromTo(
          frame,
          { y: 40 },
          { y: -40, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })

      gsap.to(progress, {
        current: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      return () => splits.forEach((s) => s.revert())
    },
    { scope: root },
  )

  return (
    <section id="artists" className="village" ref={root}>
      <div className="village__canvas" aria-hidden>
        <div className="village__sticky">
          {mounted && (
            <Suspense fallback={null}>
              <HillsScene progress={progress} active={inView} />
            </Suspense>
          )}
        </div>
      </div>
      <div className="village__inner">
        <header className="village__head">
          <p className="eyebrow">The Voices of the Village</p>
          <h2 className="village__title">Meet the artists</h2>
        </header>

        <ol className="artists">
          {ARTISTS.map((a, i) => (
            <li key={a.img} className={`artist${i % 2 ? ' artist--flip' : ''}`}>
              <figure className="artist__frame" data-cursor={`${a.name} ${a.surname}`}>
                <img src={a.img} alt={`${a.name} ${a.surname}`} loading="lazy" style={{ objectPosition: a.focus }} />
              </figure>
              <div className="artist__text">
                <h3 className="artist__name">{a.name}</h3>
                <span className="artist__rule" aria-hidden />
                <p className="artist__role">{a.surname}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
