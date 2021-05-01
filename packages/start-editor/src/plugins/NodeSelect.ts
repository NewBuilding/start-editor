import { NodeSelection, Plugin, EditorState } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { getNodeByEvent, isCtrlKey, isContainerNode } from 'start-editor-utils';
import NodeRangeSelection from './NodeRangeSelection';
import { PluginInterface } from '../interface';

const SELECTED_NODE_CLASSNAME = 'ProseMirror-selectednode';

/**
 * 1. PM点击 atom node 会直接选中, 非atom node需要按住command | ctrl 键点击才能选中，拓展后，点击容器node会被选中
 * 2. 为noderange 范围内的node也设置class name
 */
export class NodeSelectPlugin extends PluginInterface {
  get id() {
    return 'NodeSelect';
  }

  getFocusNodeDecorationSet(state: EditorState) {
    const sel = state.selection;
    if (!(sel instanceof NodeRangeSelection)) return DecorationSet.empty;
    const decorations: Decoration[] = [];
    const parent = sel.$from.parent;
    const parentPos = sel.$from.start(sel.$from.depth);
    parent.descendants((node, pos) => {
      pos += parentPos;
      if (pos >= sel.from && pos + node.nodeSize <= sel.to) {
        decorations.push(
          Decoration.node(pos, pos + node.nodeSize, {
            class: SELECTED_NODE_CLASSNAME,
          }),
        );
      }
      return true;
    });

    return DecorationSet.create(state.doc, decorations);
  }

  get plugins() {
    return [
      new Plugin({
        state: {
          init: (config, state) => {
            return this.getFocusNodeDecorationSet(state);
          },
          apply: (tr, old, state) => {
            if (tr.selection === state.selection) {
              return old;
            }

            return this.getFocusNodeDecorationSet(state);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleClick(view, _pos, event) {
            const clickedNode = getNodeByEvent(view, event);
            if (clickedNode === null) {
              return false;
            }
            const { node, pos } = clickedNode;
            // 按住 shift 和 ctrl 键再点击，会有其他的行为，所以需要过滤掉
            // atom node ProseMirror 已经内置支持点击即选中节点，所以不需要处理
            if (!event.shiftKey && !isCtrlKey(event) && isContainerNode(node)) {
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
