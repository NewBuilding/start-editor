declare let __DEV__: boolean;

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare interface Window {
  editor: any;
}
