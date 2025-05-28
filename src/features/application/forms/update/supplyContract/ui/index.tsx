import React from 'react';
import { SupplyContractFormTemplate } from '@box/entities/application';
import { IWithClass } from '@types';
import { supplyContractForm } from '../model';

export const UpdateSupplyContractApplicationForm: React.FC<IWithClass> = ({
  className
}) => (
  <SupplyContractFormTemplate
    className={className}
    form={supplyContractForm.form}
    totalPrice={supplyContractForm.$totalPrice}
    isUpdate
  />
);
