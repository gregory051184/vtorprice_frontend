import React from 'react';
import { useGate } from 'effector-react';
import { IWithClass } from '@types';
import { ApplicationsFromUsersListTemplate } from '../template';
import { purchase } from '../../model';

export const ApplicationsFromUsersPurchaseList: React.FC<IWithClass> = ({
  className
}) => {
  useGate(purchase.gate);

  return (
    <ApplicationsFromUsersListTemplate
      title="Покупка"
      selected={purchase.selected}
      setSelected={purchase.setSelected}
      className={className}
      applications={purchase.applications}
      pagination={purchase.pagination}
    />
  );
};
