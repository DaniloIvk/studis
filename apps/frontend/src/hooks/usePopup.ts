import { createContext, useContext } from 'react';
import type { PopupContext as PopupContextType } from '../types/Popup';

export const PopupContext = createContext<PopupContextType | null>(null);

/**
 * - Only available inside popup provider..
 */
function usePopup(): PopupContextType {
  const context = useContext(PopupContext);

  if (context === null) {
    throw new Error('Popup context is only available inside popup provider');
  }

  return context;
}

export default usePopup;
