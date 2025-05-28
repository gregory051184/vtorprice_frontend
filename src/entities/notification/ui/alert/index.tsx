import React from 'react';
import { Button, Modal } from '@box/shared/ui';
import { useStore } from 'effector-react';
import { useAlert } from '../../hooks';
import { $alert } from '../../model';

export const AlertDialog = () => {
  const alert = useStore($alert);
  const { onConfirm, onClose } = useAlert();

  return (
    <Modal title={alert?.title} visible={alert !== null && alert.show} close={onClose}>
      <p className="text-center text-grey-90">
        {alert?.message}
      </p>
      <div className="flex gap-[10px] mt-[20px]">
        <Button onClick={onConfirm} className="grow">Ок</Button>
      </div>
    </Modal>
  );
};
