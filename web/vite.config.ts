import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@numble/shared': path.resolve(__dirname, '../shared/game/index.ts'),
    },
  },

  server: {
    headers: {
      // Prevent MIME-type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Disallow embedding in iframes (clickjacking protection)
      'X-Frame-Options': 'DENY',
      // Limit referrer info sent to third parties
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Disable browser features the app doesn't need
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
})
