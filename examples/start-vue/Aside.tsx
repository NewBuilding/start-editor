import {defineComponent} from 'vue';


export default defineComponent({
  name: 'aside',
  setup() {
    return () => {
      return (<aside class="start-vue-main-aside">
        aside
      </aside>);
    }; 
  }
});
