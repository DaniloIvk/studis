export type PopupLevel = 'default' | 'important' | 'critical';
export type PopupPosition =
  | 'below'
  | 'above'
  | 'left'
  | 'right'
  | 'center'
  | 'screen-center';

export type PopupProps = {
  readonly title: string;
  readonly description?: string;
  readonly confirmButtonLabel?: string;
  readonly declineButtonLabel?: string;
  readonly level?: PopupLevel;
  readonly position?: PopupPosition;
  readonly discardable?: boolean;
  readonly hidden?: boolean;
  readonly setHidden?: (hidden: boolean) => void;
  readonly onConfirm?: (...args: any[]) => unknown;
  readonly onDecline?: (...args: any[]) => unknown;
  readonly onDiscard?: (...args: any[]) => unknown;
};
