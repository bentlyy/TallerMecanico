import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto por defecto de Vite
    host: true, // Para que funcione en Docker
    strictPort: true
  },
  build: {
    outDir: 'dist', // Directorio de salida para producción
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Para usar @ en imports
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./styles/variables.scss";`
      }
    }
  }
});
