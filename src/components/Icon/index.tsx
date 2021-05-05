import React from 'jsx-dom';
import type { ClassList, CSSProperties } from 'jsx-dom';
import { isFunction } from 'lodash';
import type { Name } from './iconSprite';

export type { Name as IconName };

let loaded = false;
import(/* webpackChunkName: "icon-sprite" */ './iconSprite').then((module) => {
  const loadSprite = () => {
    if (!loaded) {
      const svgSprite = module.default;
      loaded = true;
      const div = document.createElement('div');
      div.id = '__START_EDITOR_SVG_ICONS__';
      div.style.display = 'none';
      div.innerHTML = svgSprite;

      document.body.appendChild(div);
    }
  };

  loadSprite();
});

export interface IconProps {
  name: Name;
  style?: CSSProperties;
  class?: string | ClassList;
  onClick?(e: Event): void;
}

export function Icon(props: IconProps) {
  const { name, onClick, style = {} } = props;
  const defaultList = ['start-ui-icon', `start-ui-icon_${name}`];
  if (isFunction(props.class)) {
    setTimeout(() => {
      (props.class as ClassList)?.add(...defaultList);
    });
  } else {
    props.class = `${defaultList.join(' ')} ${props.class}`;
  }

  return (
    <svg onClick={onClick} class={props.class} style={style} width="50px" height="50px" fill="currentcolor">
      <use xlinkHref={`#start-ui-icon_${name}`} />
    </svg>
  );
}
