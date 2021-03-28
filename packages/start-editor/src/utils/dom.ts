import { Dictionary } from '../types';

type FilterFunction = (key: string) => boolean;

export function getDomNodeStyle(node: HTMLElement, filter: FilterFunction = () => false): CSSStyleDeclaration {
  const style = node.style;
  const obj: Dictionary = {};
  Object.keys(style).forEach((key) => {
    if (style[key as any] && Number.isNaN(parseInt(key)) && !filter(key)) {
      obj[key] = style[key as any];
    }
  });
  return obj as CSSStyleDeclaration;
}
