import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
             tailwindcss(),
  ],
  server: {
    // host: true = écoute sur 0.0.0.0, nécessaire pour être accessible depuis
    // l'extérieur d'un conteneur Docker (sans ça, seul "localhost" DANS le
    // conteneur pourrait s'y connecter).
    host: true,
    proxy: {
      '/api': {
        // En local, le backend tourne sur localhost:4000. Dans Docker Compose,
        // "localhost" depuis le conteneur frontend ne pointe pas vers le conteneur
        // backend : on utilise donc le nom du service ("backend") comme host,
        // fourni via la variable d'environnement API_PROXY_TARGET (voir docker-compose.yml).
        target: process.env.API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  }
})
