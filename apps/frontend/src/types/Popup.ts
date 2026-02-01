export type Popup = {
  readonly message: string;
  readonly level: 'info' | 'warn' | 'error';
  readonly lifetime: number;
};

export type PopupContext = {
  readonly popups: readonly Popup[];
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error?: Error): void;
  popupFromResponse(response: ReturnType<typeof JSON.parse>): void;
};
