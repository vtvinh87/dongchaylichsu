
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This makes process.env.GEMINI_API available in the client-side code.
    // Vite will replace it with the actual environment variable value during build.
    'process.env.GEMINI_API': JSON.stringify(process.env.GEMINI_API)
  }
});
