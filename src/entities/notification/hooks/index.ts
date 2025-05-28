import { useEvent } from 'effector-react';
import {
  Confirm, showConfirm, hideConfirm, Alert, showAlert, hideAlert
} from '../model';

let confirmResolve: any;
export const useConfirm = () => {
  const show = useEvent(showConfirm);
  const hide = useEvent(hideConfirm);

  const onConfirm = () => {
    hide();
    confirmResolve(true);
  };

  const onReject = () => {
    hide();
    confirmResolve(false);
  };

  const onClose = onReject;
  const confirm = (confirm: Confirm) => {
    show(confirm);
    return new Promise((resolve) => {
      confirmResolve = resolve;
    });
  };

  return {
    confirm,
    onClose,
    onConfirm,
    onReject
  };
};

export const useAlert = () => {
  const show = useEvent(showAlert);
  const hide = useEvent(hideAlert);

  const onConfirm = () => {
    hide();
  };

  const onClose = onConfirm;
  const alert = (alert: Alert) => {
    show(alert);
  };

  return {
    alert,
    onClose,
    onConfirm,
  };
};
