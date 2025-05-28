import React from 'react';
import { RecyclablesTypesFormComponentManagement } from './template';
import { buyFormStateManagement } from '../model';

export const CompanyRecyclablesTypesBuyManagement = () => (
  <RecyclablesTypesFormComponentManagement 
    active={buyFormStateManagement.formActive} 
    form={buyFormStateManagement.form} 
    onPageLoadEvent={buyFormStateManagement.onPageLoadEvent}
    name="Покупаю" />
);
