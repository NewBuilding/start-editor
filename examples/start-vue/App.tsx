import { defineComponent } from 'vue';
import { RouterView } from 'vue-router';
import Aside from './Aside';
// import Panel from './Panel';
import Header from './Header';

export default defineComponent({
  setup() {
    return () => (
      <div class="start-vue">
        <Header />
        <main class="start-vue-main">
          <Aside />
          <RouterView />
          {/* <Panel /> */}
        </main>
      </div>
    );
  },
});
