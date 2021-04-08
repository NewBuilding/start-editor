import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from '../NodeInterface';
import { NodeSpec, Dispatch, Command, StyleObject } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';
import { TODO_ITEM_NODE_NAME } from './TodoItem';

export const TODO_LIST_NODE_NAME = 'todoList';

export interface TodoListCommand<T = boolean> {}

export class TodoListNode extends NodeInterface<TodoListCommand<Command>> {
  get name(): string {
    return TODO_LIST_NODE_NAME;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: `${TODO_ITEM_NODE_NAME}+`,
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: 'dl',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
      ],
      toDOM: (node) => {
        return [
          'dl',
          {
            style: objToStyleString(node.attrs.style),
            class: 'start-editor-node start-editor-todo_list',
          },
          0,
        ];
      },
    };
  }

  commands(): TodoListCommand<Command> {
    return {};
  }
  plugins(): Plugin<any, any>[] {
    return [];
  }
}
