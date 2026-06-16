import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800, // Increase threshold warning slightly
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group 3D graphics library dependencies
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            // Group charts dependencies
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            // Group animations dependencies
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor-animation';
            }
            // Group core vendors
            return 'vendor-core';
          }
        }
      }
    }
  }
})
