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
