import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: './',
  server: {
    // 5173 は他プロジェクト (bridge-maintenance-gis) の PWA Service Worker が
    // 残っていて画面を乗っ取るため、別ポートに固定する。
    port: 5175,
    strictPort: true,
  },
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        top: 'index.html',
        competition: 'competition.html',
      },
    },
  },
})