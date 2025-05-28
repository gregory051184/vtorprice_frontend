import { useForm } from '@box/shared/effector-forms';
import { BaseInput, DatePicker } from '@box/shared/ui';
import { form } from '../model';

export const CargoUnloaded = () => {
  const { fields, hasError } = useForm(form);
  return (
    <div className="flex gap-[16px] flex-col">
      <div className="flex gap-[16px]">
        <DatePicker
          className="grow"
          error={hasError('delivery_date')}
          value={[fields.delivery_date.value, null]}
          onChange={(date) => fields.delivery_date.onChange(date[0])}
          placeholder="Дата прибытия"
        />
      </div>
      <BaseInput
        error={hasError('accepted_weight')}
        value={fields.accepted_weight.value}
        onChange={fields.accepted_weight.onChange}
        className="grow"
        placeholder="Принятый вес партии, т"
        inputAfterFloat={1}
      />
    </div>
  );
};
