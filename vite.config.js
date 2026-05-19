import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cloudflare-spa-redirects',
      closeBundle() {
        // Write _redirects into dist/ after build for Cloudflare Pages SPA routing
        fs.writeFileSync('dist/_redirects', '/*  /index.html  200\n')
      }
    }
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['enquirer-diligence-kindred.ngrok-free.dev']
  }
})
