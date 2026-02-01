import { useState, useEffect } from 'react';

/**
 * Returns true if the screen width is at least the specified breakpoint.
 * - Default size is `sm` tailwind screen size.
 */
export function useScreenSizeBreakpoint(width: number = 640): boolean {
  const [isMatch, setIsMatch] = useState<boolean>(
    window.matchMedia(`(min-width: ${width}px)`).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(`(min-width: ${width}px)`);

    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMatch(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);

    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, [width]);

  return isMatch;
}
