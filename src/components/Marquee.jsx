import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

const WORDS = ['From Sri Lanka', 'නාද ගම', 'Festival of Music', 'Since 2018']

// Infinite marquee whose speed and direction follow scroll velocity.
export default function Marquee() {
  const root = useRef(null)

  useGSAP(
    () => {
      const rows = gsap.utils.toArray('.marquee__track')
      const loops = rows.map((row, i) =>
        gsap.fromTo(
          row,
          { xPercent: i === 1 ? -50 : 0 },
          { xPercent: i === 1 ? 0 : -50, duration: 38, ease: 'none', repeat: -1 },
        ),
      )
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const dir = self.direction
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
          loops.forEach((l) => {
            gsap.killTweensOf(l)
            gsap.to(l, { timeScale: boost * dir, duration: 0.2 })
            gsap.to(l, { timeScale: dir, duration: 1.2, delay: 0.25 })
          })
        },
      })
      gsap.fromTo('.marquee', { rotate: -3 }, { rotate: 0, scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: true } })
    },
    { scope: root },
  )

  const row = (
    <>
      {[...WORDS, ...WORDS].map((w, i) => (
        <span key={i} className="marquee__item">
          {w}
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </>
  )

  return (
    <section className="marquee-wrap" ref={root} aria-label="From Sri Lanka">
      <div className="marquee">
        <div className="marquee__track">{row}</div>
        <div className="marquee__track marquee__track--outline">{row}</div>
      </div>
    </section>
  )
}
