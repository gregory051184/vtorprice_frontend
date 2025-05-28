import React from 'react';
import { IWithClass } from '@types';
import { EquipmentFormTemplate } from '@box/entities/application';
import { equipmentForm } from '../model';

export const UpdateEquipmentForm: React.FC<IWithClass> = ({
  className
}) => (
  <EquipmentFormTemplate
    form={equipmentForm.form}
    className={className}
    totalPrice={equipmentForm.$totalPrice}
    isUpdate
  />
);
