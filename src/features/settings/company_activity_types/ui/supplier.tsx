import React from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { supplierFormState } from '../model/supplier';

export const CompanyActivityTypesSupplierForm = () => (
  <CompanyActivityTypesFormTemplate
    activityId={1}
    active={supplierFormState.formActive}
    form={supplierFormState.form}
    name="Поставщик"
    advantages={supplierFormState.allAdvantages}
    selectedAdvantages={supplierFormState.selectedAdvantages}
  />
);
