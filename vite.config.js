import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE lets you deploy under a sub-path (GitHub Pages project sites), e.g. /contractguard/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: { outDir: 'dist', chunkSizeWarningLimit: 700 },
});