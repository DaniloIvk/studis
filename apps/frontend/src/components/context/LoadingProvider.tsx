import { useState, type PropsWithChildren } from 'react';
import { LoadingContext } from '../../hooks/useLoading';

function LoadingProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;
