import { Plugin, EditorState } from 'prosemirror-state';
import { NodeInterface } from '../../interface/NodeInterface';
import { NodeSpec, Dispatch, Command, StyleObject, NodeNameEnum } from '../../type';
import { objToStyleString, styleStringToObj } from 'start-editor-utils';

export interface TodoListCommand<T = boolean> {}

export class TodoListNode extends NodeInterface<TodoListCommand<Command>> {
  get name(): string {
    return NodeNameEnum.TODO_LIST;
  }

  nodeSpec(defaultStyle: StyleObject = {}): NodeSpec {
    return {
      content: `${NodeNameEnum.TODO_ITEM}+`,
      group: 'block',
      attrs: {
        style: {
          default: defaultStyle,
        },
      },
      parseDOM: [
        {
          tag: '.start-editor-todo_list',
          getAttrs(dom) {
            const element = dom as HTMLElement;
            const style = styleStringToObj(element.style.cssText, defaultStyle);
            return { style };
          },
        },
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
