import React from 'react';
import { RecyclablesTypesFormComponent } from './template';
import { buyFormState } from '../model';

export const CompanyRecyclablesTypesBuy = () => (
  <RecyclablesTypesFormComponent active={buyFormState.formActive} form={buyFormState.form} name="Покупаю" />
);
