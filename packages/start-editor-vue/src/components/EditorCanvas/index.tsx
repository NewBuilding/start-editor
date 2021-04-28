import { onMounted, defineComponent, ref, PropType } from 'vue';
import './index.less';
import { StartEditor, ProseMirrorPlugin } from 'start-editor';
import { getPlugins } from '../../plugins';

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
    // const plugins = getPlugins(props.editor).reduce(
    //   (result, p) => [...result, ...p.plugins],
    //   [] as ProseMirrorPlugin[],
    // );
    // props.editor.addPlugins(plugins);
    onMounted(() => {
      container.value?.appendChild(props.editor.container);
    });
    return () => <div class="start-editor-container" ref={container}></div>;
  },
});
