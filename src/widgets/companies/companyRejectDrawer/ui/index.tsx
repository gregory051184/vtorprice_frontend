import React, { useState } from 'react';
import { Button, Drawer, TextArea } from '@box/shared/ui';
import { ICompanyRejectDrawer } from './types';

export const CompanyRejectDrawer: React.FC<ICompanyRejectDrawer> = ({
  visible,
  close,
  onSubmit
}) => {
  const [rejectionMessage, setRejectionMessage] = useState<string>('');
  const onRejectClick = () => {
    onSubmit(rejectionMessage);
  };
  return (
    <Drawer
      bottomActions={(
        <Button
          fullWidth
          onClick={onRejectClick}
        >
          Отклонить
        </Button>
      )}
      visible={visible}
      close={close}
      title="Отклонить"
    >
      <TextArea onChange={setRejectionMessage} value={rejectionMessage} rows={14} placeholder="Укажите причину" />
    </Drawer>
  );
};
