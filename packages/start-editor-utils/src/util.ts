type FilterFunction = (key: string) => boolean;

export function getElementStyle(
  node: HTMLElement,
  filter: FilterFunction = () => false,
): CSSStyleDeclaration {
  const style = node.style;
  const obj: Record<string, any> = {};
  Object.keys(style).forEach((key) => {
    if (style[key as any] && Number.isNaN(parseInt(key)) && !filter(key)) {
      obj[key] = style[key as any];
    }
  });
  return obj as CSSStyleDeclaration;
}

export function objToStyleString(obj: Partial<CSSStyleDeclaration>): string {
  return Object.entries(obj).reduce((all, [key, value]) => {
    const property = `${camelToKebab(key)}:${value};`;
    return all + property;
  }, '');
}

export function styleStringToObj(cssStr: string): Partial<CSSStyleDeclaration> {
  return cssStr
    .split(';')
    .map((str) => str.split(';'))
    .reduce((obj, [key, value]) => {
      key = kebabToCamel(key);
      return { ...obj, [key]: value };
    }, {}) as Partial<CSSStyleDeclaration>;
}

export function camelToKebab(name: string): string {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function kebabToCamel(name: string): string {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase());
}
