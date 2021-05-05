import { PluginInterface } from '@/interface';
import { PluginIDEnum } from '@/@types';
import { Plugin } from 'prosemirror-state';
import { createTextMenu } from '@/components';
import { throttle } from 'lodash';
import { EditorView } from 'prosemirror-view';
import type { NodeCursorAnchorPlugin } from './NodeCursorAnchor';
import type { TextMenu } from '@/components';
export class TextMenuPlugin extends PluginInterface {
  ID: string = PluginIDEnum.TEXT_MENU;
  textMenu!: TextMenu;
  throttleShowTextMenu = throttle(
    (view: EditorView) => {
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
    this.mountTextMenu();
  }

  private mountTextMenu() {
    this.textMenu = createTextMenu({ editor: this.editor });
    const element = this.textMenu.element;
    this.editor.shell.appendChild(element);
    const anchorPlugin = this.editor.getPlugin<NodeCursorAnchorPlugin>(PluginIDEnum.NODE_CURSOR_ANCHOR);
    anchorPlugin.createCursorPopper(element, {
      placement: 'top-start',
    });
  }
}
