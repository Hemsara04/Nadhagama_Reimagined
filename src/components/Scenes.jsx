import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SCENES } from '../data'

// Pinned horizontal gallery with a gold progress rail — the "Scenes" strip from the original, reimagined.
export default function Scenes() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current.querySelector('.scenes__track')
        const dist = () => track.scrollWidth - window.innerWidth + 80
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
        gsap.to('.scenes__bar i', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true },
        })
        gsap.utils.toArray('.scene img').forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -12 },
            { xPercent: 12, ease: 'none', scrollTrigger: { trigger: img.parentNode, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
          )
        })
        gsap.utils.toArray('.scene').forEach((el) => {
          gsap.from(el.querySelector('figcaption'), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left 70%' },
          })
        })
      })
      mm.add('(max-width: 767px)', () => {
        gsap.utils.toArray('.scene').forEach((el) =>
          gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }),
        )
      })
    },
    { scope: root },
  )

  return (
    <section id="scenes" className="scenes" ref={root}>
      <div className="scenes__head">
        <h2 className="title title--sm">Moments from the village</h2>
      </div>
      <div className="scenes__track">
        {SCENES.map((s) => (
          <figure key={s.src} className={`scene ${s.tall ? 'scene--tall' : ''}`} data-cursor="View">
            <div className="scene__media">
              <img src={s.src} alt={s.caption} loading="lazy" />
            </div>
            <figcaption>
              <span>{s.caption}</span>
              <em>{s.place}</em>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="scenes__bar">
        <i />
      </div>
    </section>
  )
}
