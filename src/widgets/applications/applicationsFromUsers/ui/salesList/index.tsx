import React from 'react';
import { useGate } from 'effector-react';
import { IWithClass } from '@types';
import { ApplicationsFromUsersListTemplate } from '../template';
import { sales } from '../../model';

export const ApplicationsFromUsersSalesList: React.FC<IWithClass> = ({
  className
}) => {
  useGate(sales.gate);

  return (
    <ApplicationsFromUsersListTemplate
      selected={sales.selected}
      setSelected={sales.setSelected}
      title="Продажа"
      className={className}
      applications={sales.applications}
      pagination={sales.pagination}
    />
  );
};
