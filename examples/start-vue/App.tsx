import { defineComponent, watch, ref } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Aside from './Aside';
// import Panel from './Panel';
import Header from './Header';

export default defineComponent({
  setup() {
    const route = useRoute();
    const showAside = ref(true);
    watch(
      () => route.query,
      () => {
        if (route.query.hideAside) {
          showAside.value = false;
        }
      },
      { immediate: true },
    );
    return () => (
      <div class="start-vue">
        <Header />
        <main class="start-vue-main">
          {showAside.value && <Aside />}
          <RouterView />
          {/* <Panel /> */}
        </main>
      </div>
    );
  },
});
