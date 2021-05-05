import React, { createRef } from 'jsx-dom';
import { createPopper } from '@popperjs/core';
import { classnames, animationShow, animationHide } from '@/utils';
import './index.less';

import type { BaseChildrenProps } from '@/@types';
import type Popper from '@popperjs/core';
import type { CSSProperties } from 'jsx-dom';

export interface PopoverProps extends BaseChildrenProps {
  content: BaseChildrenProps['children'];
  placement?: Popper.Options['placement'];
  offset?: [number, number];
  modifiers?: Popper.Options['modifiers'];
  onClick?: (e: Event) => void;
  popoverClass?: string;
  popoverStyle?: CSSProperties;
  ref?: (popover: HTMLElement) => void;
}

export function Popover(props: PopoverProps) {
  props = Object.assign<Omit<PopoverProps, 'children' | 'content'>, any>(
    {
      placement: 'bottom',
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
  const contentElement = (
    <div class={classnames('start-ui-popover', props.popoverClass)} style={props.popoverStyle}>
      {props.content}
    </div>
  ) as HTMLElement;
  document.body.appendChild(contentElement);
  props.ref && props.ref(contentElement);

  const maskElement = (
    <div class="start-ui-popover-mask" onClick={(e) => e.stopPropagation()}></div>
  ) as HTMLElement;
  document.body.appendChild(maskElement);

  let instance: Popper.Instance;

  const onMaskClick = (e: Event) => {
    if (e.target !== contentElement && !contentElement.contains(e.target as HTMLElement)) hide();
  };

  const show = () => {
    if (!instance && containerRef.current) {
      instance = createPopper(containerRef.current, contentElement, {
        placement: props.placement,
        modifiers: props.modifiers,
      });
    }
    instance.update();
    animationShow(contentElement);
    maskElement.style.visibility = 'visible';
    maskElement?.addEventListener('click', onMaskClick);
  };

  const hide = () => {
    maskElement.style.visibility = 'hidden';
    animationHide(contentElement);
    maskElement.removeEventListener('click', onMaskClick);
  };

  const onClick = (e: Event) => {
    show();
    props.onClick && props.onClick(e);
  };

  return (
    <div
      class={classnames('start-ui-popover-anchor', props.class)}
      style={props.style}
      ref={containerRef}
      onClick={onClick}
    >
      {props.children}
    </div>
  );
}
