import { useState } from 'react';
import ConfirmationPopup from '../components/popups/ConfirmationPopup';
import type { PopupProps } from '../types/ConfirmationPopup';
import type { Confirm } from '../types/Confirm';

export function useConfirm(
  props: Omit<PopupProps, 'hidden' | 'setHidden'>
): Confirm {
  const [hidden, setHidden] = useState<boolean>(true);
  const [pendingPayload, setPendingPayload] = useState<any[]>([]);

  /**
   * Opens the confirmation dialog with the given properties.
   */
  function ask(...args: any[]) {
    setPendingPayload(args);
    setHidden(false);
  }

  function handleConfirm() {
    if (typeof props.onConfirm === 'function') {
      props.onConfirm(...pendingPayload);
    }
  }

  /**
   * Popup component.
   */
  const Component = props && (
    <ConfirmationPopup
      position='screen-center'
      setHidden={setHidden}
      hidden={hidden}
      {...props}
      onConfirm={handleConfirm}
    />
  );

  return { ask, Component };
}
