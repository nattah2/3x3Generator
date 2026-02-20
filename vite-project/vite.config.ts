import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      lucide: fileURLToPath(new URL('./node_modules/lucide/dist/esm/lucide/src/lucide.js', import.meta.url)),
      // or for icons folder if needed:
      // 'lucide/icons': fileURLToPath(new URL('./node_modules/lucide/dist/esm/icons', import.meta.url)),
    },
  },
});
