import React from 'react';
import { IWithClass } from '@types';
import { $totalPrice, equipmentForm } from '../model';
import { EquipmentCreateTemplate } from '@box/entities/application/ui/templates/equipmentForm';



export const CreateEquipmentForm: React.FC<IWithClass> = ({
  className
}) => (
  // <EquipmentFormTemplate
  //   form={equipmentForm}
  //   className={className}
  //   totalPrice={$totalPrice}
  //   buttonText="Опубликовать"
  // />
    <EquipmentCreateTemplate
        form={equipmentForm}
        className={className}
        totalPrice={$totalPrice}
        buttonText="Опубликовать"
    />
);

