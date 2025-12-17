import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    https: {
      key: fs.readFileSync('./src/services/ssl/localhost-key.pem'),
      cert: fs.readFileSync('./src/services/ssl/localhost.pem'),
    },
    port: 5173,
  }
})
