import { onMounted, defineComponent, ref, PropType } from 'vue';
import './index.less';
import { StartEditor } from 'start-editor';

interface EditorCanvasProps {
  editor: StartEditor;
}

export default defineComponent({
  props: {
    editor: {
      type: Object as PropType<EditorCanvasProps['editor']>,
      required: true,
    },
  },
  setup(props) {
    const container = ref<HTMLDivElement | null>(null);
    onMounted(() => {
      container.value?.appendChild(props.editor.container);
    });
    return () => <div class="start-editor-container" ref={container}></div>;
  },
});
