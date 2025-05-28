import React from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { customerFormState } from '../model/customer';

export const CompanyActivityTypesCustomerForm = () => (
  <CompanyActivityTypesFormTemplate
    activityId={3}
    active={customerFormState.formActive}
    form={customerFormState.form}
    name="Покупатель"
    advantages={customerFormState.allAdvantages}
    selectedAdvantages={customerFormState.selectedAdvantages}
  />
);
