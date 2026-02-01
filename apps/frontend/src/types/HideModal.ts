export type HideModal = {
  hideModal: boolean;
  setHideModal(hideModal: boolean | ((hideModal: boolean) => any)): void;
};
