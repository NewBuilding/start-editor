import { detect } from 'detect-browser';

const browser = detect();

export function isCtrlKey(_event: Event) {
  const event = (_event as unknown) as KeyboardEvent;

  return browser?.os === 'Mac OS' ? event.metaKey : event.ctrlKey;
}

/**
 * 在macbook返回⌘， window 返回⌃
 */
export function getCtrlChar() {
  return browser?.os === 'Mac OS' ? '⌘' : '⌃';
}
