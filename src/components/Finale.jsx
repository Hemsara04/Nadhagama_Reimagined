import { lazy, Suspense, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { FESTIVAL, PORTAL_URL } from '../data'
import Magnetic from './Magnetic'
import { ArrowIcon } from './Nav'
import { asset } from '../asset'

const Embers = lazy(() => import('./Embers'))

export default function Finale() {
  const root = useRef(null)

  useGSAP(
    () => {
      const split = SplitText.create('.finale__title', { type: 'words, chars', wordsClass: 'w', charsClass: 'c' })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom bottom' },
      })
      tl.from(split.chars, {
        opacity: 0,
        filter: 'blur(12px)',
        y: 40,
        stagger: { each: 0.04, from: 'center' },
        duration: 1.4,
        ease: 'expo.out',
        clearProps: 'filter',
      })
        .from('.finale__sub, .finale .pill', { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out' }, 0.5)
      gsap.fromTo(
        '.finale__bg',
        { scale: 1.25, yPercent: -10 },
        { scale: 1, yPercent: 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section className="finale" ref={root}>
      <img className="finale__bg" src={asset('/site/crowd.webp')} alt="" loading="lazy" />
      <div className="finale__shade" />
      <Suspense fallback={null}>
        <Embers count={220} className="embers--soft" />
      </Suspense>
      <div className="finale__inner">
        <h2 className="finale__title">From Sri Lanka</h2>
        <p className="finale__sub">
          {FESTIVAL.place} · {FESTIVAL.dates}
        </p>
        <Magnetic>
          <a className="pill pill--gold pill--lg" href={PORTAL_URL} target="_blank" rel="noreferrer" data-cursor="Join">
            Pre Register <ArrowIcon />
          </a>
        </Magnetic>
      </div>
    </section>
  )
}
