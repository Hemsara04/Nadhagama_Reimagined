import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { asset } from '../asset'

const ASSETS = [
  asset('/images/360.jpg'),
  asset('/images/360_celebrating_all.jpg'),
  asset('/site/logo-white.png'),
  asset('/site/naadha-gama-festival-2027.jpg'),
]
const MAX_WAIT = 6000 // ms — a slow or stalled image must never keep the loader up forever

export default function Loader({ onDone }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const counter = { v: 0 }
      const num = root.current.querySelector('.loader__num')
      const images = Promise.all(
        ASSETS.map(
          (src) =>
            new Promise((res) => {
              const img = new Image()
              img.onload = img.onerror = res
              img.src = src
            }),
        ),
      )
      const loaded = Promise.race([images, new Promise((res) => setTimeout(res, MAX_WAIT))])

      const tl = gsap.timeline({ paused: true })
      tl.to(counter, {
        v: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, '0')),
      })
        .to('.loader__fill', { clipPath: 'inset(0% 0 0 0)', duration: 2.2, ease: 'power2.inOut' }, 0)
        .to('.loader__line', { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, 0)
        .to('.loader__logo', { scale: 1.08, opacity: 0, duration: 0.7, ease: 'power3.in' }, '+=0.15')
        .to('.loader__meta', { opacity: 0, y: 10, duration: 0.4 }, '<')
        .add(() => onDone?.(), '-=0.2')
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, '-=0.25')
        .set(root.current, { display: 'none' })

      let cancelled = false
      loaded.then(() => !cancelled && tl.play())
      return () => (cancelled = true)
    },
    { scope: root },
  )

  return (
    <div className="loader" ref={root} aria-hidden>
      <div className="loader__logo">
        <span className="loader__ghost logo-mask" />
        <span className="loader__fill logo-mask" />
      </div>
      <div className="loader__meta">
        <span>Festival of Music</span>
        <span className="loader__line" />
        <span className="loader__num">000</span>
      </div>
    </div>
  )
}
