// Resolves a file in /public against the deploy base, so the site works at a domain root
// (Vercel / Netlify / custom domain) and under a sub-path (GitHub Pages: /<repo>/).
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')
