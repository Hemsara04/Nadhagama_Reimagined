import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import '@fontsource/prata/400.css'
import './index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
// Mobile browsers resize the viewport as the URL bar shows/hides; don't recalculate (and jump) on that.
ScrollTrigger.config({ ignoreMobileResize: true })
// Always start at the top: the hero is scroll-locked and reveals from the first photo.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
