import { PORTAL_URL } from '../data'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__logo logo-mask" role="img" aria-label="Naadha Gama, established 2018" />
      <div className="footer__row">
        <span className="footer__since">Since 2018</span>
        <nav className="footer__links" aria-label="Footer">
          <a href={PORTAL_URL} target="_blank" rel="noreferrer">Portal</a>
          <i>•</i>
          <a href="https://naadhagama.lk/privacy-policy">Privacy Policy</a>
          <i>•</i>
          <a href="https://naadhagama.lk/terms-and-conditions">Terms & Conditions</a>
        </nav>
        <a href="#top" className="footer__top">
          Back to top ↑
        </a>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Naadha Gama. All rights reserved.</p>
    </footer>
  )
}
