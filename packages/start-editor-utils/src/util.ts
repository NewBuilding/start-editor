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

/**
 * 查找两个对象中key 和val都相同的属性，并返回所有满足要求的attr的key
 * @param obj
 * @param targetObj
 */
export function getSaveAttrKeys(obj: Record<string, any>, targetObj: Record<string, any>): string[] {
  const keys: string[] = [];
  Object.entries(targetObj).forEach(([key, val]) => {
    if (obj[key] && obj[key] === val) {
      keys.push(key);
    }
  });
  return keys;
}

const reURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
/**
 * 是否url链接
 * @param url
 */
export function isUrl(url: string) {
  return reURL.test(url);
}

/**
 * 单纯通过后缀判断是否为图片
 * @param url
 */
export function isImageBySuffix(url: string): boolean {
  return /.*(\.png|\.jpg|\.jpeg|\.gif)$/.test(url);
}

/**
 * 追加px后缀
 * @param val
 */
export function px(val: number) {
  return `${val}px`;
}
