/**
 * 从当前元素向父级查找元素，直到找到拥有该classname的dom 元素，否则返回null
 * @param dom
 * @param classname
 * @param isIgnore isIgnore: (dom: HTMLElement) => boolean 返回true，则忽略这个元素，继续往上查找
 */
export function getParentElementByClassName(
  dom: HTMLElement,
  classname: string,
  isIgnore: (dom: HTMLElement) => boolean = () => false,
): HTMLElement | null {
  let ele = dom;
  while (!ele.classList.contains('ProseMirror')) {
    if (ele.classList.contains(classname) && !isIgnore(ele)) {
      return ele;
    }
    ele = ele.parentElement as HTMLElement;
  }
  return null;
}

/**
 *
 * 返回 element 相对于container的位置信息
 * @param container
 * @param element
 */
export function getRelatviePosition(container: HTMLElement, element: HTMLElement) {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return {
    left: elementRect.left - containerRect.left,
    top: elementRect.top - containerRect.top,
  };
}

/**
 * 追加px后缀
 * @param val
 */
export function px(val: number) {
  return `${val}px`;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * 设置element的 Rect信息
 * @param elemet
 * @param rect
 */
export function setElementRect(elemet: HTMLElement, rect: Rect) {
  const { left, width, top, height } = rect;
  elemet.style.left = px(left);
  elemet.style.top = px(top);
  elemet.style.width = px(width);
  elemet.style.height = px(height);
}

/**
 * 检测element的classlist是否包含classNames中的某一个
 * @param element
 * @param classnames
 */
export function elementHasClassNames(element: HTMLElement, classnames: string[]) {
  for (const classname of classnames) {
    if (element.classList.contains(classname)) return true;
  }
  return false;
}
