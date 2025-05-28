import React from 'react';
import { RecyclablesTypesFormComponent } from './template';
import { sellFormState } from '../model';

export const CompanyRecyclablesTypesSell = () => (
  <RecyclablesTypesFormComponent active={sellFormState.formActive} form={sellFormState.form} name="Продаю" />
);
