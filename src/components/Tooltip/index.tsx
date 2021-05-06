import React, { createRef } from 'jsx-dom';
import './index.less';
import Popper, { createPopper } from '@popperjs/core';
import { classnames, animationShow, animationHide, setStyle } from '@/utils';
import { shell } from '@/Editor';
import type { BaseChildrenProps } from '@/@types';

export interface TooltipProps extends BaseChildrenProps {
  title: string | HTMLElement;
  placement?: Popper.Options['placement'];
  offset?: [number, number];
  modifiers?: Popper.Options['modifiers'];
  onClick?: (e: Event) => void;
}

export function Tooltip(props: TooltipProps) {
  props = Object.assign<Omit<TooltipProps, 'children' | 'title'>, any>(
    {
      placement: 'top',
      offset: [0, 8],
      modifiers: [],
      onClick: () => {},
    },
    props,
  );
  if (!props.modifiers?.find((modifier) => modifier.name === 'offset')) {
    props.modifiers = props.modifiers || [];
    props.modifiers.push({
      name: 'offset',
      options: {
        offset: props.offset,
      },
    });
  }
  const containerRef = createRef<HTMLDivElement>();
  const titleContent = (
    <div class="start-ui-tooltip">
      <div class="start-ui-tooltip_arrow" data-popper-arrow></div>
      {props.title}
    </div>
  ) as HTMLElement;
  setStyle(titleContent, { display: 'none' });
  shell.appendChild(titleContent);

  let instance: Popper.Instance | null = null;
  const onEnter = () => {
    if (!instance) {
      if (!containerRef.current) return;
      instance = createPopper(containerRef.current, titleContent, {
        placement: props.placement,
        modifiers: props.modifiers,
      });
    }
    animationShow(titleContent);
    instance.update();
  };
  const onLeave = () => {
    animationHide(titleContent);
  };
  return (
    <div
      class={classnames('start-ui-tooltip-anchor', props.class)}
      style={props.style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={containerRef}
      onClick={props.onClick as any}
    >
      {props.children}
    </div>
  );
}
