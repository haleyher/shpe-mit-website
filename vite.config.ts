import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the built site works whether MIT Athena serves it
  // from the locker root or a subfolder.
  base: './',
  // Build into "build/" (committed to git) so deploying = `git pull` on Athena,
  // matching how the old Create React App site was served from scripts.mit.edu.
  build: {
    outDir: 'build',
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Lets you import using "@/..." instead of long relative paths.
      '@': path.resolve(__dirname, './src'),
    },
  },
})
