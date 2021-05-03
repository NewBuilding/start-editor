import React, { createRef } from 'jsx-dom';
import './index.less';
import Popper, { createPopper } from '@popperjs/core';

export interface TooltipProps {
  children: HTMLElement | SVGElement | string;
  title: string | HTMLElement;
  placement?: Popper.Options['placement'];
  offset?: [number, number];
  modifiers?: Popper.Options['modifiers'];
}

export function Tooltip(props: TooltipProps) {
  props = Object.assign<Omit<TooltipProps, 'children' | 'title'>, any>(
    {
      placement: 'top-start',
      offset: [0, 5],
      modifiers: [],
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
    <div class="start-editor-tooltip" id="tooltip">
      <div class="start-editor-tooltip_arrow" id="arrow" data-popper-arrow></div>
      {props.title}
    </div>
  ) as HTMLElement;
  document.body.appendChild(titleContent);

  let instance: Popper.Instance | null = null;
  const onEnter = () => {
    if (!instance) {
      if (!containerRef.current) return;
      instance = createPopper(containerRef.current, titleContent, {
        placement: props.placement,
        modifiers: props.modifiers,
      });
    }
    instance.update();
    titleContent.style.visibility = 'visible';
  };
  const onLeave = () => {
    titleContent.style.visibility = 'hidden';
  };
  return (
    <div class="start-editor-tooltip-anchor" onMouseEnter={onEnter} onMouseLeave={onLeave} ref={containerRef}>
      {props.children}
    </div>
  );
}
