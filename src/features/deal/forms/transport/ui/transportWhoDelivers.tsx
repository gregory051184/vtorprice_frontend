import { dealDelivery } from '@box/entities/deal';
import { useField } from '@box/shared/effector-forms';
import { TabSelect } from '@box/shared/ui';
import { transportForm } from '../model';

export const TransportWhoDelivers = () => {
  const { value, onChange } = useField(transportForm.fields.whoDelivers);

  return (
    <TabSelect
      label="Кто доставляет"
      values={dealDelivery}
      value={value}
      onChange={onChange}
    />
  );
};
