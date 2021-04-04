import { onMounted, defineComponent, ref, PropType, watch } from 'vue';
import { StartEditor } from 'start-editor';
import './index.less';

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
      const editorEl = props.editor?.$el;
      editorEl && container.value?.appendChild(editorEl);
    });
    return () => (
      <div class="start-editor-container" ref={container}></div>
    );
  },
});

