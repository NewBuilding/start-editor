import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

const links = [
  {
    title: 'table示例',
    content: 'table',
  },
  {
    title: 'list示例',
    content: 'list',
  },
  {
    title: '梦游天姥吟留别',
    content: 'poem',
  },
  {
    title: '快前拖拽菜单',
    content: 'beforeMenu',
  },
  {
    title: '媒体',
    content: 'media',
  },
  {
    title: 'flexbox',
    content: 'flexbox',
  },
];
export default defineComponent({
  name: 'aside',
  setup() {
    return () => {
      return (
        <aside class="start-vue-main-aside">
          {links.map(({ title, content }) => [
            <RouterLink to={{ name: 'editor', query: { content } }}>{title}</RouterLink>,
            <br />,
          ])}
        </aside>
      );
    };
  },
});
