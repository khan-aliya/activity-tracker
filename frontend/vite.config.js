import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html'
    })
  ],
  
  // Day 8: Performance optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['react-bootstrap', 'bootstrap'],
          'utils': ['axios', 'chart.js']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  
  server: {
    host: 'localhost',
    port: 5173,
    hmr: {
      clientPort: 5173
    },
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  },
  
  preview: {
    port: 4173,
    host: true
  }
});