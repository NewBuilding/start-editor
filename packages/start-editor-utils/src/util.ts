export function objToStyleString(obj: Partial<CSSStyleDeclaration>): string {
  return Object.entries(obj).reduce((all, [key, value]) => {
    const property = `${camelToKebab(key)}:${value};`;
    return all + property;
  }, '');
}

export function styleStringToObj(
  cssStr: string,
  defaultStyle: Partial<CSSStyleDeclaration> = {},
): Partial<CSSStyleDeclaration> {
  if (!cssStr) return defaultStyle;
  return cssStr
    .split(';')
    .map((str) => str.split(':'))
    .reduce((obj, [key, value]) => {
      key = kebabToCamel(key);
      return { ...obj, [key]: value };
    }, defaultStyle) as Partial<CSSStyleDeclaration>;
}

export function camelToKebab(name: string): string {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function kebabToCamel(name: string): string {
  return name.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase());
}
