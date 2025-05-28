import React from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { supplierFormStateManagement } from '../model/supplier';

export const CompanyActivityTypesSupplierFormManagement = () => {
  return(
  <CompanyActivityTypesFormTemplate
    activityId={1}
    active={supplierFormStateManagement.formActive}
    form={supplierFormStateManagement.form}
    name="Поставщик"
    advantages={supplierFormStateManagement.allAdvantages}
    selectedAdvantages={supplierFormStateManagement.selectedAdvantages}
    onPageLoadEvent={supplierFormStateManagement.onPageLoadEvent}
  />
)};
