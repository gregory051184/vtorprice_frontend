import React from 'react';
import { IWithClass } from '@types';
import { ReadyForShipmentFormTemplate } from '@box/entities/application';
import {
  $totalPrice,
  $totalWeight,
  readyForShipmentForm
} from '../model';

export const CreateReadyForShipmentApplicationForm: React.FC<IWithClass> = ({
  className
}) => (
  <ReadyForShipmentFormTemplate
    form={readyForShipmentForm}
    className={className}
    totalWeight={$totalWeight}
    totalPrice={$totalPrice}
  />
);
