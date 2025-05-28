import React from 'react';
import { RecyclablesTypesFormComponentManagement } from './template';
import { sellFormStateManagement } from '../model';

export const CompanyRecyclablesTypesSellManagement = () => {

  return (
    <RecyclablesTypesFormComponentManagement 
      active={sellFormStateManagement.formActive} 
      form={sellFormStateManagement.form} 
      onPageLoadEvent={sellFormStateManagement.onPageLoadEvent}
      name="Продаю" />
  )
};
