import React from 'react';
import { IWithClass } from '@types';
import { SupplyContractFormTemplate } from '@box/entities/application';

import {
  supplyContractForm,
  $totalPrice
} from '../model';

export const CreateSupplyContractApplicationForm: React.FC<IWithClass> = ({
  className
}) => (
  <SupplyContractFormTemplate
    className={className}
    form={supplyContractForm}
    totalPrice={$totalPrice}
  />
);
