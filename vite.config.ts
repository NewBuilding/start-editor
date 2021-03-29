import { defineConfig } from 'vite';
// import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // root: ''
  // plugins: [vue()],
  alias: {
    'start-editor': '../packages/start-editor/src',
    'start-editor-vue': '../packages/start-editor-vue/src',
    'start-editor-utils': '../packages/start-editor-utils/src',
  },
});
