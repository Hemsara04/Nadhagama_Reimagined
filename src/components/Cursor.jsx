import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Soft gold firefly cursor that grows over interactive elements.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.documentElement.classList.add('has-cursor')
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.12 })
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.12 })
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      xd(e.clientX)
      yd(e.clientY)
      xr(e.clientX)
      yr(e.clientY)
      const hot = e.target.closest('a, button, [data-cursor]')
      ring.current.classList.toggle('is-hot', !!hot)
      ring.current.dataset.label = hot?.dataset.cursor || ''
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden />
      <div className="cursor-ring" ref={ring} aria-hidden />
    </>
  )
}
