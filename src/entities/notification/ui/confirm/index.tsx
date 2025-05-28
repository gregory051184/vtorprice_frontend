import React from 'react';
import { Button, Modal } from '@box/shared/ui';
import { useStore } from 'effector-react';
import { useConfirm } from '../../hooks';
import { $confirm } from '../../model';

export const ConfirmDialog = () => {
  const confirm = useStore($confirm);
  const { onConfirm, onClose, onReject } = useConfirm();
  return (
    <Modal title={confirm?.title} visible={confirm !== null && confirm.show} close={onClose}>
      <p className="text-center text-grey-90">
        {confirm?.message}
      </p>
      <div className="flex gap-[10px] mt-[20px]">
        <Button onClick={onConfirm} className="grow">Ок</Button>
        <Button onClick={onReject} className="grow" mode="light">Отменить</Button>
      </div>
    </Modal>
  );
};
