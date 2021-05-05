import React from 'jsx-dom';
import './index.less';
import { classnames } from '@/utils';
import type { BaseProps } from '@/@types';

export interface DividerProps extends BaseProps {
  type?: 'horizontal' | 'vertical';
}

export function Divider(props: DividerProps) {
  props = Object.assign<DividerProps, DividerProps>({ type: 'vertical', style: {} }, props);
  return (
    <hr
      class={classnames('start-ui-divider', `start-ui-divider_${props.type}`, props.class)}
      style={props.style}
    />
  );
}
