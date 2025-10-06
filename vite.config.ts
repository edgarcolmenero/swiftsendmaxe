import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = resolve(__dirname, 'src/pages');

export default defineConfig({
  root,
  build: {
    rollupOptions: {
      input: {
        home: resolve(root, 'home/index.html'),
        contact: resolve(root, 'contact/index.html'),
        faq: resolve(root, 'faq/index.html'),
        calendar: resolve(root, 'calendar/index.html')
      }
    },
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@app': resolve(__dirname, 'src/app'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@features': resolve(__dirname, 'src/features'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@data': resolve(__dirname, 'src/data')
    }
  }
});
