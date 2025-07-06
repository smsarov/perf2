import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteRemoveConsole from 'vite-plugin-remove-console'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteRemoveConsole(),
    viteImagemin({
      // Optimize PNG
      optipng: { optimizationLevel: 7 },
      // Optimize JPEG
      mozjpeg: { quality: 75 },
      // Optimize SVG
      svgo: { 
        plugins: [
          { name: 'removeViewBox', active: false },
        ]
      },
      // Convert to WebP
      webp: { quality: 50 },
    }),
  ],
  base: '/perf2/',
  build: {
    minify: 'esbuild', // Fast minification
    sourcemap: false,  // No source maps in production
    cssCodeSplit: true, // Split CSS for better caching
    assetsInlineLimit: 4096, // Inline small assets as base64
    rollupOptions: {
      output: {
        manualChunks: undefined, // Let Vite handle chunk splitting
      },
    },
  },
})
