import React from 'jsx-dom';
import './index.less';
import { Tooltip, Icon, Divider } from '@/components';
import { getCtrlChar } from '@/utils';
import type { IconName } from '../Icon';
import type { StartEditor } from '@/Editor';

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

export function TextMenu(props: TextMenuProps) {
  return (
    <div class="start-ui-text-menu">
      <Tooltip title={`增加链接 ${getCtrlChar()}+k`} class="item">
        <Icon name="link" class="icon" />
        <Icon name="down" class="icon-down" />
      </Tooltip>
      <Divider />
      <Tooltip class="item" title="字体大小">
        12
        <Icon name="down" class="icon-down" />
      </Tooltip>
      {Items.map((item) => {
        if (item.type === 'divider') {
          return <Divider />;
        }
        return (
          <Tooltip title={item.title} class="item">
            <Icon name={item.icon} class="icon" />
            {item.arrow ? <Icon name="down" class="icon-down" /> : ''}
          </Tooltip>
        );
      })}
    </div>
  );
}

export function mounted() {}
