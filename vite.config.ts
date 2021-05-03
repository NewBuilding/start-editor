import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import domJsx from 'vite-plugin-dom-jsx';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // root: ''
  plugins: [domJsx({ include: [/\/src\//], pragma: 'React.createElement' }), vue(), vueJsx()],
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  define: {
    'process.env': process.env,
  },
});
