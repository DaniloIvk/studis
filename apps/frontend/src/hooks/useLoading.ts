import { createContext, useContext } from 'react';
import type { LoadingContext as LoadingContextType } from '../types/Loading';

export const LoadingContext = createContext<LoadingContextType | null>(null);

/**
 * - Only available inside loading provider.
 */
function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);

  if (context === null) {
    throw new Error(
      'Loading context is only available inside loading provider'
    );
  }

  return context;
}

export default useLoading;
