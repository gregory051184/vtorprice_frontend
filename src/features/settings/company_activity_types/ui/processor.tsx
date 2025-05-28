import React from 'react';
import { CompanyActivityTypesFormTemplate } from './template';
import { processorFormState } from '../model/processor';

export const CompanyActivityTypesProcessorForm = () => (
  <CompanyActivityTypesFormTemplate
    activityId={2}
    active={processorFormState.formActive}
    form={processorFormState.form}
    name="Переработчик"
    advantages={processorFormState.allAdvantages}
    selectedAdvantages={processorFormState.selectedAdvantages}
  />
);
