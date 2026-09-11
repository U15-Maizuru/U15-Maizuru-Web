import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fg from 'fast-glob'

// guide/*.html (CHaser 解説ページ) はページ数が多く、増減のたびに
// この設定を手で編集するのを避けるため、動的に列挙して input に追加する。
const guidePages = Object.fromEntries(
  fg.sync('guide/*.html').map(file => [
    `guide-${file.replace(/^guide\//, '').replace(/\.html$/, '')}`,
    file,
  ])
)

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
        ...guidePages,
      },
    },
  },
})