import { PluginInterface } from '../interface';
import { PluginIDEnum, NodeCursorAnchorPlugin } from '..';
import { Plugin } from 'prosemirror-state';
import { TextMenu } from '../components';
import { throttle } from 'lodash';
import { EditorView } from 'prosemirror-view';

export class TextMenuPlugin extends PluginInterface {
  ID: string = PluginIDEnum.TEXT_MENU;
  textMenu!: { show: Function; hide: Function };
  throttleShowTextMenu = throttle(
    (view: EditorView) => {
      console.log('节流');
      const sel = view.state.selection;
      if (!sel.empty) {
        this.textMenu?.show();
      }
    },
    600,
    { leading: false, trailing: true },
  );

  get plugins(): Plugin[] {
    return [
      new Plugin({
        view: () => {
          return {
            update: (view) => {
              const sel = view.state.selection;
              if (sel.empty) {
                this.textMenu?.hide();
              } else {
                this.throttleShowTextMenu(view);
              }
            },
          };
        },
      }),
    ];
  }

  mounted() {
    this.textMenu = this.mountTextMenu();
  }

  private mountTextMenu() {
    const element = TextMenu() as HTMLElement;
    this.editor.shell.appendChild(element);
    const anchorPlugin = this.editor.getPlugin<NodeCursorAnchorPlugin>(PluginIDEnum.NODE_CURSOR_ANCHOR);
    anchorPlugin.createCursorPopper(element, {
      placement: 'top-start',
    });
    return {
      show() {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
      },
      hide() {
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
      },
    };
  }
}
