import { PluginInterface } from '@/interface';
import { PluginIDEnum } from '@/@types';
import { Plugin } from 'prosemirror-state';
import { createTextMenu } from '@/components';
import { throttle } from 'lodash';
import { EditorView } from 'prosemirror-view';
import type { NodeCursorAnchorPlugin, PopperInstance } from './NodeCursorAnchor';
import { isTextSelection } from '@/utils';
export class TextMenuPlugin extends PluginInterface {
  ID: string = PluginIDEnum.TEXT_MENU;
  textMenuPopper!: PopperInstance | undefined;
  throttleShowTextMenu = throttle(
    (view: EditorView) => {
      if (this.isShow(view)) {
        this.textMenuPopper?.show();
      }
    },
    400,
    { leading: false, trailing: true },
  );

  isShow(view: EditorView) {
    const sel = view.state.selection;
    return isTextSelection(sel) && !sel.empty && this.editor.isFocus;
  }

  get plugins(): Plugin[] {
    return [
      new Plugin({
        view: () => {
          return {
            update: (view) => {
              if (this.isShow(view)) {
                this.throttleShowTextMenu(view);
              } else {
                this.textMenuPopper?.hide();
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
    this.textMenuPopper = anchorPlugin?.createCursorPopper(textMenu.element, {
      placement: 'top-start',
      doBeforeShow: textMenu.update,
    });
  }
}
