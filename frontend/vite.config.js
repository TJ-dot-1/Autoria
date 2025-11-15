import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Custom plugin to remove COEP/COOP headers from dev server
const removeCoepCoopPlugin = () => ({
  name: 'remove-coep-coop',
  transformIndexHtml(html) {
    // Remove any COEP/COOP meta tags that might be in HTML
    return html
      .replace(/<meta[^>]*Cross-Origin-Embedder-Policy[^>]*>/gi, '')
      .replace(/<meta[^>]*Cross-Origin-Opener-Policy[^>]*>/gi, '')
  },
  configureServer(server) {
    return () => {
      // Intercept responses to remove COEP/COOP headers
      server.middlewares.use((req, res, next) => {
        // Store the original setHeader method
        const originalSetHeader = res.setHeader
        res.setHeader = function(name, value) {
          if (name && name.toLowerCase && (
            name.toLowerCase() === 'cross-origin-embedder-policy' ||
            name.toLowerCase() === 'cross-origin-opener-policy'
          )) {
            // Skip setting these headers
            return res
          }
          return originalSetHeader.call(this, name, value)
        }
        next()
      })
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), removeCoepCoopPlugin()],
  server: {
    headers: {
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Access-Control-Allow-Origin': '*'
    }
  }
})
