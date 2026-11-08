import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { EDITIONS } from '../data'

// Expanding accordion panels — hover (or tap) to open an edition.
export default function Editions() {
  const root = useRef(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      gsap.from('.edition', {
        clipPath: 'inset(100% 0 0 0)',
        stagger: 0.12,
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: '.editions__list', start: 'top 80%' },
      })
      gsap.from('.editions .section-head > *', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    },
    { scope: root },
  )

  return (
    <section id="editions" className="section editions" ref={root}>
      <div className="section-head">
        <p className="eyebrow">Editions</p>
        <h2 className="title">
          One village, <em>many stages.</em>
        </h2>
      </div>
      <div className="editions__list">
        {EDITIONS.map((e, i) => (
          <article
            key={e.name}
            className={`edition ${active === i ? 'is-active' : ''}`}
            onPointerEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            data-cursor="Explore"
          >
            <img src={e.img} alt={`${e.name} — ${e.tag}`} loading="lazy" />
            <div className="edition__shade" />
            <div className="edition__body">
              <span className="edition__tag">{e.tag}</span>
              <h3>{e.name}</h3>
              <p>{e.text}</p>
            </div>
            <span className="edition__vert">{e.name}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
