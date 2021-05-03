import type { Position, SizeRect } from '@/@types';
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
export function getRelatviePosition(container: HTMLElement, position: HTMLElement | Position) {
  const containerRect = container.getBoundingClientRect();
  if (position instanceof HTMLElement) {
    const { left, top } = position.getBoundingClientRect();
    position = { left, top };
  }

  return {
    left: position.left - containerRect.left,
    top: position.top - containerRect.top,
  };
}

/**
 * 追加px后缀
 * @param val
 */
export function px(val: number) {
  return `${val}px`;
}

/**
 * 设置element的 Rect信息
 * @param elemet
 * @param rect
 */
export function setElementRect(elemet: HTMLElement, rect: SizeRect) {
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

export interface BoxRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
/**
 * 判断两个box是否有交集
 * @param box1
 * @param box2
 */
export function isBoxIntersection(box1: BoxRect, box2: BoxRect) {
  return !(
    box1.bottom < box2.top ||
    box1.top > box2.bottom ||
    box1.right < box2.left ||
    box1.left > box2.right
  );
}

/**
 * 判断box1 与 nodeBox是否有至少两条边相交
 * @param box
 * @param nodeBox
 */
export function isBoxHasTwoSideIntersaction(box: BoxRect, node: BoxRect) {
  const isLeftIntersact = box.left < node.left && box.right > node.left;
  const isRightIntersact = box.left < node.right && box.right > node.right;
  const isTopIntersact = box.top < node.top && box.bottom > node.top;
  const isBottomIntersact = box.top < node.bottom && box.bottom > node.bottom;
  return (
    (isLeftIntersact && isTopIntersact) ||
    (isLeftIntersact && isBottomIntersact) ||
    (isRightIntersact && isTopIntersact) ||
    (isRightIntersact && isBottomIntersact) ||
    (isLeftIntersact && isRightIntersact && !(box.top > node.bottom || box.bottom < node.top)) ||
    (isTopIntersact && isBottomIntersact && box.left < node.left && box.right > node.right) ||
    (isLeftIntersact && isRightIntersact && isTopIntersact && isBottomIntersact)
  );
}
