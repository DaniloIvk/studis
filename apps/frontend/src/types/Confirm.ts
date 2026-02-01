import type ConfirmationPopup from '../components/popups/ConfirmationPopup';

export type Confirm = {
  ask(...args: any[]): unknown;
  Component: ReturnType<typeof ConfirmationPopup> | null;
};
