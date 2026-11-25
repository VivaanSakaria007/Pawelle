import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { pawelleSyncPlugin } from './server/pawelleSyncPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pawelleSyncPlugin()],
  server: {
    port: 5173,
    host: true
  },
  preview: {
    host: true,
    allowedHosts: true
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
