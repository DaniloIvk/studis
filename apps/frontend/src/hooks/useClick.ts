import { useEffect, type RefObject } from 'react';

function useClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: Function,
  active: boolean = true,
) {
  useEffect(() => {
    if (!active) {
      return;
    }

    const element = ref?.current;

    if (!element) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (element && !element.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, handler, active]);
}

export default useClick;
