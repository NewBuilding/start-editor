
import { defineComponent } from 'vue';
import Aside from './Aside';
import Editor from './Editor';
// import Panel from './Panel';
import Header from './Header';


export default defineComponent({
  setup() {
    return () =>(
      <div class="start-vue">
        <Header />
        <main class="start-vue-main">
          <Aside />
          <Editor />
          {/* <Panel /> */}
        </main>
      </div>
    ); 
  },
});
