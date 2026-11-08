import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset URLs: the same build works at a domain root or under a sub-path (GitHub Pages).
  base: './',
  build: {
    chunkSizeWarningLimit: 1000, // three.js alone is ~930 kB and is lazy-loaded
    rolldownOptions: {
      output: {
        // keep three.js in its own cached chunk, loaded only when a WebGL scene is near
        codeSplitting: { groups: [{ name: 'three', test: /node_modules[\\/](three|@react-three)/ }] },
      },
    },
  },
})
