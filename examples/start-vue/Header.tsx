import { defineComponent } from 'vue';
import { editor } from './Editor';

export default defineComponent({
  setup() {
    const onclick = () => {
      editor.commandMap.style.add({ fontWeight: 'bold' });
    };
    const onLinkClick = () => {
      editor.commandMap.link.toggle({ href: 'https://baidu.com' });
    };
    return () => (
      <div class="start-vue-header">
        <div></div>
        <button onClick={onclick}>加粗</button>
        <button onClick={onLinkClick}>link</button>
      </div>
    );
  },
});
