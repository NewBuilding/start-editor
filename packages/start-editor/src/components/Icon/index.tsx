import React, { CSSProperties } from 'jsx-dom';
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
  class?: string;
  onClick?(e: Event): void;
}

export default function Icon(props: IconProps) {
  const { name, onClick, class: classname = '', style = {} } = props;
  return (
    <svg
      onClick={onClick}
      style={style}
      class={`start-editor-icon start-editor-icon--${name} ${classname}`}
      width="50px"
      height="50px"
      fill="currentcolor"
    >
      <use xlinkHref={`#start-editor-icon--${name}`} />
    </svg>
  );
}
