# Naadha Gama — modern site

React + Vite rebuild of [naadhagama.lk](https://naadhagama.lk/), keeping the original's night-festival vibe: deep warm black (`#0a0806`), festival gold (`#d3ba59`), and the brand typefaces — **Cinzel Decorative**, **Cinzel**, **Product Sans**, with **Prata** for small labels.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

Requires Node 20.19+ (or 22.12+).

## Deploy

`npm run build` outputs a static site in `dist/`. Asset URLs are relative (`base: './'` in `vite.config.js`), so the same build works:

- **Vercel / Netlify / Cloudflare Pages** — build command `npm run build`, output directory `dist`.
- **GitHub Pages** — publish the `dist/` folder (e.g. with a Pages workflow); it works under `https://<user>.github.io/<repo>/` without changes.
- **Any static host** — upload the contents of `dist/`.

Files in `public/` must be referenced through `asset('/path')` from `src/asset.js` (not a bare `"/path"`), so they resolve under a sub-path too.

## Stack

| Library | Used for |
| --- | --- |
| `gsap` + ScrollTrigger + SplitText, `@gsap/react` | Loader, scroll-locked 360° hero reveal, scroll-velocity marquee, word-by-word story reveal, artist line-up reveals, pinned horizontal Scenes gallery, magnetic buttons, cursor |
| `three`, `@react-three/fiber` | "Village of Sound" gold contour hills behind the artists, finale embers (custom GLSL shaders) |
| `lenis` | Smooth scrolling, synced to the GSAP ticker |

three.js is code-split and only downloaded when a WebGL section is near; canvases pause when offscreen. Reduced-motion users get static layouts.

## Structure

- `src/data.js` — festival details, portal URL, scenes, editions and artist line-up (edit content here)
- `src/components/` — one file per section (`Hero`, `Upcoming`, `Story`, `Village` (artists), `Editions`, `Scenes`, `Finale`, …)
- `public/site/` — imagery and logos from the current naadhagama.lk
- `public/images/`, `public/artists/`, `public/places/` — supplied photos
