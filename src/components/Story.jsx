import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { asset } from '../asset'

export default function Story() {
  const root = useRef(null)

  useGSAP(
    () => {
      // words light up like lanterns as you scroll through the paragraph
      const split = SplitText.create('.story__text', { type: 'words', wordsClass: 'w' })
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.story__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.utils.toArray('.story__img').forEach((img, i) => {
        gsap.fromTo(
          img,
          { yPercent: 20 + i * 15 },
          { yPercent: -20 - i * 10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
      gsap.from('.story__est > *', {
        yPercent: 110,
        stagger: 0.1,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.story__est', start: 'top 85%' },
      })
      return () => split.revert()
    },
    { scope: root },
  )

  return (
    <section id="story" className="section story" ref={root}>
      <div className="story__est" aria-hidden>
        <span>Since</span>
        <span>2018</span>
      </div>
      <p className="story__text">
        Naadha Gama <br></br>began with a simple idea:
        Eight years on, the village has grown from Mathara to the world stage — and it still feels like coming home.
      </p>
      <figure className="story__img story__img--a">
        <img src={asset('/site/lanterns.webp')} alt="Paper lanterns over the festival grounds" loading="lazy" />
      </figure>
      <figure className="story__img story__img--b">
        <img src={asset('/site/guitarist.webp')} alt="A guitarist playing to the crowd on the village stage" loading="lazy" />
      </figure>
    </section>
  )
}
