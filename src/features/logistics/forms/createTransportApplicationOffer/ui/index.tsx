import React from 'react';
import { IWithClass } from '@types';
import { useGate, useUnit } from 'effector-react';
import {
  AsyncSelect,
  BaseInput, Button, DatePicker, Paper 
} from '@box/shared/ui';
import { useForm } from '@box/shared/effector-forms';
import { contractorsSelectApi } from '@box/entities/contractors/api/selects/contractorsSelect';
import { applyForm, form, gate } from '../model';
import { IMyOffer } from '@box/entities/logistics/model';

export const CreateTransportApplicationOfferForm: React.FC<{logistOffer?: IMyOffer} & IWithClass> = ({
  className,
  logistOffer
}) => {
  const { fields, submit, hasError, error } = useForm(form);
  const handleApplyForm = useUnit(applyForm)

  useGate(gate);
  
  const handleOnClickSend = () => {
      handleApplyForm('send')
      submit()
  };

  const handleOnClickChange = () => {
      handleApplyForm('change')
      submit()
  };

  return (
    <Paper className="flex pl-4 pr-4 pt-4 pb-4 gap-4 border border-solid border-grey-20">
      <AsyncSelect
        required
        error={hasError('contractor')}
        placeholder="Контрагент"
        loadData={contractorsSelectApi} 
        value={fields.contractor.value}
        onSelect={fields.contractor.onChange}
      />
      <DatePicker
        required
        error={hasError('uploadDate')}
        amountOfMonths={1}
        value={[fields.uploadDate.value, null]} 
        onChange={(val) => fields.uploadDate.onChange(val[0])} 
      />
      <BaseInput
        required
        error={hasError('amount')}
        placeholder="Стоимость, руб"
        className={className}
        value={fields.amount.value}
        onChange={fields.amount.onChange}
      />
      {logistOffer ? <Button onClick={handleOnClickChange}>Изменить</Button> : <Button onClick={handleOnClickSend}>Отправить</Button>}
    </Paper>
  );
};
