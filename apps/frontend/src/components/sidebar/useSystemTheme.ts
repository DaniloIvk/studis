import { useState, useEffect } from 'react';
import Theme, { type CaseType } from '../../enums/Theme';

export const useSystemTheme = (): CaseType => {
  const [systemTheme, setSystemTheme] = useState<CaseType>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? Theme.DARK
      : Theme.LIGHT;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? Theme.DARK : Theme.LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return systemTheme;
};
