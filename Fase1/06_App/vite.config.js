// Configuración de Vite (empaquetador) con soporte para React
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
