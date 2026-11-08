import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { FESTIVAL, PORTAL_URL } from '../data'
import Magnetic from './Magnetic'
import { ArrowIcon } from './Nav'

function useCountdown(target) {
  const calc = () => {
    const ms = Math.max(0, new Date(target) - Date.now())
    return {
      Days: Math.floor(ms / 864e5),
      Hours: Math.floor(ms / 36e5) % 24,
      Minutes: Math.floor(ms / 6e4) % 60,
      Seconds: Math.floor(ms / 1e3) % 60,
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return t
}

export default function Upcoming() {
  const root = useRef(null)
  const card = useRef(null)
  const time = useCountdown(FESTIVAL.start)

  useGSAP(
    () => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      tl.from('.section-head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out' })
        .from('.poster', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut' }, 0.1)
        .from('.poster img', { scale: 1.4, duration: 2, ease: 'expo.out' }, 0.5)
        .from('.upcoming__info > *', { y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }, 0.8)
    },
    { scope: root },
  )

  // 3D tilt with a moving gold sheen
  useEffect(() => {
    const el = card.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    const rx = gsap.quickTo(el, 'rotateX', { duration: 0.8, ease: 'power3' })
    const ry = gsap.quickTo(el, 'rotateY', { duration: 0.8, ease: 'power3' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * 10)
      rx((0.5 - py) * 8)
      el.style.setProperty('--mx', `${px * 100}%`)
      el.style.setProperty('--my', `${py * 100}%`)
    }
    const leave = () => (rx(0), ry(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <section id="festival" className="section upcoming" ref={root}>
      <div className="section-head">
        <p className="eyebrow">Upcoming Festival</p>
        <h2 className="title">
          Eight years of memories
        </h2>
      </div>

      <div className="upcoming__stage">
        <article className="upcoming__card" ref={card} data-cursor="Pre Register">
          <a href={PORTAL_URL} target="_blank" rel="noreferrer" className="poster">
            <img src={FESTIVAL.poster} alt="Naadha Gama Festival of Music 2027 poster — Nuwara Eliya, 4th to 6th February" />
            <span className="poster__sheen" />
          </a>
          <div className="upcoming__info">
            <div>
              <h3>{FESTIVAL.title}</h3>
              <p className="muted">
                {FESTIVAL.place} · {FESTIVAL.dates}
              </p>
            </div>
            <Magnetic>
              <a className="pill pill--gold" href={PORTAL_URL} target="_blank" rel="noreferrer">
                Pre Register <ArrowIcon />
              </a>
            </Magnetic>
          </div>
        </article>

        <aside className="countdown" aria-label="Countdown to the festival">
          <p className="eyebrow">More to go </p>
          <div className="countdown__grid">
            {Object.entries(time).map(([k, v]) => (
              <div key={k} className="countdown__cell">
                <span className="countdown__num">{String(v).padStart(2, '0')}</span>
                <span className="countdown__label">{k}</span>
              </div>
            ))}
          </div>
          <ul className="facts">
            <li>Nuwara Eliya, Sri Lanka</li>
            <li>4th, 5th &amp; 6th February 2027</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}
