import React, { useText, ClassList, createRef } from 'jsx-dom';
import './index.less';
import { Tooltip, Icon, Divider, Popover } from '@/components';
import { getCtrlChar, getRangeStyle, rangeHasStyle, useClassList, isUrl, animationHide } from '@/utils';

import type { IconName } from '../Icon';
import type { StartEditor } from '@/Editor';
import type { StyleObject } from '@/@types';

export interface TextMenuProps {
  editor: StartEditor;
}

enum StyleType {
  FONT_SIZE = 'FONT_SIZE',
  FONT_COLOR = 'FONT_COLOR',
  BG_COLOR = 'BG_COLOR',
  BOLD = 'BOLD',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  STRIKE = 'STRIKE',
}

interface Item {
  type: StyleType;
  icon: IconName;
  title: string;
  arrow?: boolean;
}

interface DividerItem {
  type: 'divider';
}

const ItemClassListMap: Record<StyleType, ClassList> = {
  [StyleType.FONT_SIZE]: useClassList('icon'),
  [StyleType.FONT_COLOR]: useClassList('icon'),
  [StyleType.BG_COLOR]: useClassList('icon'),
  [StyleType.BOLD]: useClassList('icon'),
  [StyleType.ITALIC]: useClassList('icon'),
  [StyleType.UNDERLINE]: useClassList('icon'),
  [StyleType.STRIKE]: useClassList('icon'),
};

const Items: Array<Item | DividerItem> = [
  {
    type: StyleType.FONT_COLOR,
    title: '字体颜色',
    arrow: true,
    icon: 'color',
  },
  {
    type: StyleType.BG_COLOR,
    title: '背景颜色',
    arrow: true,
    icon: 'background-color',
  },
  {
    type: 'divider',
  },
  {
    type: StyleType.BOLD,
    icon: 'bold',
    title: `加粗 ${getCtrlChar()}+B`,
  },
  {
    type: StyleType.ITALIC,
    icon: 'italic',
    title: `斜体 ${getCtrlChar()}+I`,
  },
  {
    type: StyleType.UNDERLINE,
    icon: 'underline',
    title: `下划线 ${getCtrlChar()}+U`,
  },
  {
    type: StyleType.STRIKE,
    icon: 'strike',
    title: `下划线 ${getCtrlChar()}+D`,
  },
];

export interface TextMenu {
  element: HTMLElement;
  update: () => void;
}

const ITEM_ACTIVE_CLASS = 'active-icon';

export function createTextMenu(props: TextMenuProps): TextMenu {
  const { editor } = props;

  const [fontSize, setFontSize] = useText('0');

  let rangeStyle;
  let activeMap: Record<StyleType, boolean | Array<string>>;
  const getCurrentFontSize = () => {
    const { view, state } = editor;
    let node = view.domAtPos(state.selection.from + 1).node as Element;
    if (node.nodeType !== 1) {
      node = node.parentElement as Element;
    }
    return Number.parseInt(getComputedStyle(node).fontSize);
  };

  const onItemClick = (type: StyleType) => {
    return () => {
      const { remove, add } = editor.commandMap.style;
      const style: StyleObject = {};
      switch (type) {
        case StyleType.BOLD:
          style.fontWeight = 'bold';
          activeMap[type] ? remove(style) : add(style);
          break;
        case StyleType.ITALIC:
          style.fontStyle = 'italic';
          activeMap[type] ? remove(style) : add(style);
          break;
        case StyleType.UNDERLINE:
          style.textDecoration = 'underline';
          activeMap[type] ? remove(style) : add(style);
          break;
        case StyleType.STRIKE:
          style.textDecoration = 'line-through';
          activeMap[type] ? remove(style) : add(style);
          break;
      }
      update();
    };
  };
  let hidePopover: Function | null = null;
  const input = createRef<HTMLInputElement>();
  const linkClassList = useClassList('start-ui-link-content');

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    const inputVal = input.current?.value || '';
    if (!isUrl(inputVal)) {
      linkClassList.add('start-ui-link-content-error');
      return;
    }
    hidePopover?.();
    editor.commandMap.link.toggle({ href: inputVal, target: '_blank' });
    e.preventDefault();
    editor.view.focus();
  };

  const onInput = () => {
    const inputVal = input.current?.value;
    if (inputVal && !isUrl(inputVal)) {
      linkClassList.add('start-ui-link-content-error');
    } else {
      linkClassList.remove('start-ui-link-content-error');
    }
  };

  const linkContent = (
    <div class={linkClassList}>
      <input type="text" ref={input} onKeyDown={onKeyDown} onInput={onInput} />
      <span class="msg">非法url</span>
    </div>
  );

  const element = (
    <div class="start-ui-text-menu">
      <Popover
        popoverRef={(ele: HTMLElement, hide) => {
          hidePopover = hide;
        }}
        content={linkContent}
        placement="bottom-start"
        onHide={() => {
          editor.view.focus();
        }}
        onClick={(e) => {
          editor.isFocus = false;
          editor.editableDom.blur();
          e.stopPropagation();
          editor.isFocus = true;
          input.current?.focus();
        }}
      >
        <Tooltip title={`增加链接 ${getCtrlChar()}+k`} class="item">
          <Icon name="link" class="icon" />
          <Icon name="down" class="icon-down" />
        </Tooltip>
      </Popover>
      <Divider />
      <Tooltip class="item" title="字体大小">
        {fontSize as any}
        <Icon name="down" class="icon-down" />
      </Tooltip>
      {Items.map((item) => {
        if (item.type === 'divider') {
          return <Divider />;
        }
        return (
          <Tooltip
            title={item.title}
            class="item"
            data-text-menu-item={item.type}
            onClick={onItemClick(item.type)}
          >
            <Icon name={item.icon} class={ItemClassListMap[item.type]} />
            {item.arrow ? <Icon name="down" class="icon-down" /> : ''}
          </Tooltip>
        );
      })}
    </div>
  ) as HTMLElement;

  const update = () => {
    rangeStyle = getRangeStyle(editor.state);
    activeMap = {
      [StyleType.FONT_SIZE]: rangeStyle.fontSize && [...rangeStyle.fontSize],
      [StyleType.FONT_COLOR]: rangeStyle.color && [...rangeStyle.color],
      [StyleType.BG_COLOR]: rangeStyle.backgroundColor && [...rangeStyle.backgroundColor],
      [StyleType.BOLD]: rangeHasStyle(rangeStyle, 'fontWeight', 'bold'),
      [StyleType.ITALIC]: rangeHasStyle(rangeStyle, 'fontStyle', 'italic'),
      [StyleType.UNDERLINE]: rangeHasStyle(rangeStyle, 'textDecoration', 'underline'),
      [StyleType.STRIKE]: rangeHasStyle(rangeStyle, 'textDecoration', 'line-through'),
    };
    setFontSize(getCurrentFontSize().toString());
    Object.entries(activeMap).forEach(([key, val]) => {
      const classList = ItemClassListMap[key as StyleType];
      if (val) {
        classList.add(ITEM_ACTIVE_CLASS);
      } else if (classList?.contains(ITEM_ACTIVE_CLASS)) {
        classList.remove(ITEM_ACTIVE_CLASS);
      }
    });
    if (input.current) {
      input.current.value = '';
    }
  };
  return {
    element,
    update,
  };
}
