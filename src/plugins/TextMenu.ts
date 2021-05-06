import { PluginInterface } from '@/interface';
import { PluginIDEnum } from '@/@types';
import { Plugin } from 'prosemirror-state';
import { createTextMenu } from '@/components';
import { throttle } from 'lodash';
import { EditorView } from 'prosemirror-view';
import type { NodeCursorAnchorPlugin, PopperInstance } from './NodeCursorAnchor';
export class TextMenuPlugin extends PluginInterface {
  ID: string = PluginIDEnum.TEXT_MENU;
  textMenuPopper!: PopperInstance;
  throttleShowTextMenu = throttle(
    (view: EditorView) => {
      const sel = view.state.selection;
      if (!sel.empty) {
        this.textMenuPopper?.show();
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
                this.textMenuPopper?.hide();
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

  mountTextMenu() {
    const textMenu = createTextMenu({ editor: this.editor });
    const anchorPlugin = this.editor.getPlugin<NodeCursorAnchorPlugin>(PluginIDEnum.NODE_CURSOR_ANCHOR);
    this.textMenuPopper = anchorPlugin.createCursorPopper(textMenu.element, {
      placement: 'top-start',
      doBeforeShow: textMenu.update,
    });
  }
}
