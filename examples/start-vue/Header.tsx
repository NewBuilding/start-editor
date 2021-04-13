import { defineComponent } from 'vue';
import {editor} from './Editor';


export default defineComponent({
  setup() {
    const onclick = () => {
      editor.commands.style.add({fontWeight: 'bold'});
    };
    return () =>(
      <div class="start-vue-header">
        <button onClick={onclick}>加粗</button>
      </div>
    ); 
  },
});
