import { useForm } from '@box/shared/effector-forms';
import { BaseInput, DatePicker } from '@box/shared/ui';
import { form } from '../model';
import VMasker from "vanilla-masker";

export const CargoLoaded = () => {
  const { fields, hasError } = useForm(form);
  return (
    <div className="flex gap-[16px] flex-col">
      <div className="flex gap-[16px]">
        <DatePicker
          error={hasError('shipping_date')}
          className="grow"
          value={[fields.shipping_date.value, null]}
          onChange={(date) => fields.shipping_date.onChange(date[0])}
          placeholder="Дата загрузки"
        />
        <BaseInput
          className="grow"
          placeholder="Время загрузки"
          error={hasError(('loading_hours'))}
          onChange={(val) => fields.loading_hours.onChange(VMasker.toPattern(val, '99:99'))}
          value={fields.loading_hours.value}
        />
      </div>
      <DatePicker
        className="grow"
        error={hasError('delivery_date')}
        value={[fields.delivery_date.value, null]}
        onChange={(date) => fields.delivery_date.onChange(date[0])}
        placeholder="Ориентировочная дата прибытия"
      />
      <BaseInput
        error={hasError('loaded_weight')}
        value={fields.loaded_weight.value}
        onChange={fields.loaded_weight.onChange}
        className="grow"
        placeholder="Точный загруженный вес, т"
        inputAfterFloat={1}
      />
    </div>
  );
};
