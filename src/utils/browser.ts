import { detect } from 'detect-browser';

const browser = detect();

export function isCtrlKey(_event: Event) {
  const event = (_event as unknown) as KeyboardEvent;

  return browser?.os === 'Mac OS' ? event.metaKey : event.ctrlKey;
}

export default browser;
