import { createContext, useContext } from 'react';
import type { QueryContext as QueryContextType } from '../types/Query';

export const QueryContext = createContext<QueryContextType | null>(null);

/**
 * - Only available inside query provider.
 */
function useQuery(): QueryContextType {
  const context = useContext(QueryContext);

  if (context === null) {
    throw new Error('Loading context is only available inside query provider');
  }

  return context;
}

export default useQuery;
