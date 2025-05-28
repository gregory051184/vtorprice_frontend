import React from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { processorFormStateManagement } from '../model/processor';

export const CompanyActivityTypesProcessorFormManagement = () => (
  <CompanyActivityTypesFormTemplate
    activityId={2}
    active={processorFormStateManagement.formActive}
    form={processorFormStateManagement.form}
    name="Переработчик"
    advantages={processorFormStateManagement.allAdvantages}
    selectedAdvantages={processorFormStateManagement.selectedAdvantages}
    onPageLoadEvent={processorFormStateManagement.onPageLoadEvent}
  />
);
