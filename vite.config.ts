import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  // root: ''
  plugins: [vue(), vueJsx()],
  alias: {
    'start-editor': '../packages/start-editor/src',
    'start-editor-vue': '../packages/start-editor-vue/src',
    'start-editor-utils': '../packages/start-editor-utils/src',
  },
  define: {
    'process.env': process.env,
  },
});
