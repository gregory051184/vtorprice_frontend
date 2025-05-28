import React, { useState } from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { customerFormStateManagement } from '../model/customer';

export const CompanyActivityTypesCustomerFormManagement = () => {
return(
  <CompanyActivityTypesFormTemplate
    activityId={3}
    active={customerFormStateManagement.formActive}
    form={customerFormStateManagement.form}
    name="Покупатель"
    advantages={customerFormStateManagement.allAdvantages}
    selectedAdvantages={customerFormStateManagement.selectedAdvantages}
    onPageLoadEvent={customerFormStateManagement.onPageLoadEvent}
  />
)};
