import { dealDelivery } from '@box/entities/deal';
import { useField } from '@box/shared/effector-forms';
import { TabSelect } from '@box/shared/ui';
import { form } from '../model';
import s from './style.module.scss';

export const EquipmentWhoDelivers = () => {
  const { value, onChange } = useField(form.fields.whoDelivers);

  return (
    <TabSelect
      label="Кто доставляет"
      values={dealDelivery}
      value={value}
      onChange={onChange}
      className={s.tabs}
    />
  );
};
