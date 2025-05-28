import React from 'react';
import { IWithClass } from '@types';
import { EquipmentFormTemplate } from '@box/entities/application';
import { $totalPrice, equipmentForm } from '../model';

export const CreateEquipmentForm: React.FC<IWithClass> = ({
  className
}) => (
  <EquipmentFormTemplate
    form={equipmentForm}
    className={className}
    totalPrice={$totalPrice}
    buttonText="Опубликовать"
  />
);

