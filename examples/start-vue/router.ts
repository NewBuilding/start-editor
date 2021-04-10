import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Editor from './Editor';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'editor',
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
