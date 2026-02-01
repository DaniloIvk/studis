import { useState } from 'react';
import type { HideModal } from '../types/HideModal';

function useHideModel(initialState: boolean = true): HideModal {
  const [hideModal, setHideModal] = useState<boolean>(initialState);

  return { hideModal, setHideModal };
}

export default useHideModel;
