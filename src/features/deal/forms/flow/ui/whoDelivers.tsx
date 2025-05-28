import { dealDelivery } from '@box/entities/deal';
import { useField } from '@box/shared/effector-forms';
import { TabSelect } from '@box/shared/ui';
import { form } from '../model';

export const WhoDelivers = () => {
  const { value, onChange } = useField(form.fields.whoDelivers);
  return (
    <TabSelect
      label="Кто доставляет"
      values={dealDelivery} 
      value={value} 
      onChange={onChange}
    />
  );
};
