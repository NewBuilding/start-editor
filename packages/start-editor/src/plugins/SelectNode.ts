import { NodeSelection, Plugin } from 'prosemirror-state';
import { PluginInterface } from '../interface';
import { getNodeByEvent, isCtrlKey } from 'start-editor-utils';

/**
 * 用于拓展内置的点击节点即选中，内置的为点击 atom node 会直接选中
 * 拓展后，点击 content 为 block 的 node，会直接选中, selected node 会增加ProseMirror
 */
export class SelecNodePlugin extends PluginInterface {
  get plugins() {
    return [
      new Plugin({
        props: {
          handleClick(view, _pos, event) {
            const clickedNode = getNodeByEvent(view, event);
            console.log(clickedNode);

            if (clickedNode === null) {
              return false;
            }

            const { node, pos } = clickedNode;

            // 按住 shift 和 ctrl 键再点击，会有其他的行为，所以需要过滤掉
            // atom node ProseMirror 已经内置支持点击即选中节点，所以不需要处理
            if (!event.shiftKey && !isCtrlKey(event) && !node.isTextblock && !node.isAtom && node.isBlock) {
              const tr = view.state.tr;
              tr.setSelection(NodeSelection.create(view.state.doc, pos));
              view.dispatch(tr);
              return true;
            }

            return false;
          },
        },
      }),
    ];
  }
}
