import { MarkSpec } from 'prosemirror-model';
import { Plugin, EditorState, Transaction } from 'prosemirror-state';
import { MarkInterface } from '../interface/MarkInterface';
import { Schema, Command, StyleObject, MarkNameEnum } from '@/@types';
import { objToStyleString, styleStringToObj, getSaveAttrKeys } from '@/utils';
import { get, omit } from 'lodash';

export interface StyleCommand<T = boolean> {
  /**
   * 为选区内的文字追加样式
   * @param style
   */
  add(style: StyleObject): T;
  /**
   * 先清空选区内的样式，再增加样式
   * @param style
   */
  clearAndAdd(style: StyleObject): T;
  /**
   * 删除指定样式，仅删除key和value都相同的样式
   * @param style
   */
  remove(style: StyleObject): T;
}

export class StyleMark extends MarkInterface<StyleCommand<Command>> {
  name = MarkNameEnum.STYLE;

  markSpec(defaultStyle: StyleObject = {}): MarkSpec {
    return {
      group: 'inline',
      isinline: true,
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'span.start-editor-style',
          getAttrs(dom) {
            const ele = dom as HTMLElement;
            return {
              style: styleStringToObj(ele.style.cssText, defaultStyle),
            };
          },
        },
      ],
      toDOM: (node) => {
        const style = objToStyleString(node.attrs.style);
        return ['span', { style, class: 'start-editor-mark start-editor-style' }, 0];
      },
    };
  }

  plugins(): Plugin[] {
    return [];
  }

  commands(): StyleCommand<Command> {
    return {
      add(style) {
        return (state, dispatch) => {
          if (!style) return false;
          dispatch?.(addStyleForRangeText(state, style, 'assign'));
          return true;
        };
      },
      clearAndAdd(style) {
        return (state, dispatch) => {
          if (!style) return false;
          dispatch?.(addStyleForRangeText(state, style, 'clear_add'));
          return true;
        };
      },
      remove(style) {
        return (state, dispatch) => {
          if (!style) return false;
          dispatch?.(deleteStyleForRangeText(state, style));
          return true;
        };
      },
    };
  }
}

type StyleAction = 'assign' | 'clear_add';

function addStyleForRangeText(
  state: EditorState,
  style: StyleObject,
  action: StyleAction = 'assign',
  from: number = state.selection.from,
  to: number = state.selection.to,
): Transaction {
  const tr = state.tr;
  const styleMark = (state.schema as Schema).marks.style;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === 'text') {
      const sameMark = node.marks.find((m) => m.type.name === styleMark.name);
      const targetStyle = action === 'assign' ? { ...get(sameMark, 'attrs.style', {}), ...style } : style;
      const mark = styleMark.create({ style: targetStyle });
      const _from = pos < from ? from : pos;
      const _to = pos + node.nodeSize > to ? to : pos + node.nodeSize;
      tr.addMark(_from, _to, mark);
    }
  });
  return tr;
}

function deleteStyleForRangeText(
  state: EditorState,
  removeAttrs: StyleObject,
  from: number = state.selection.from,
  to: number = state.selection.to,
): Transaction {
  const tr = state.tr;
  const styleMark = (state.schema as Schema).marks.style;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === 'text') {
      const sameMark = node.marks.find((m) => m.type.name === styleMark.name);
      if (!sameMark) return;
      const currentStyle = sameMark?.attrs.style;
      const keys = getSaveAttrKeys(currentStyle, removeAttrs);
      if (keys.length === 0) return;
      const newStyle = omit(currentStyle, keys);
      const mark = styleMark.create({ style: newStyle });
      const _from = pos < from ? from : pos;
      const _to = pos + node.nodeSize > to ? to : pos + node.nodeSize;
      tr.addMark(_from, _to, mark);
    }
  });
  return tr;
}
