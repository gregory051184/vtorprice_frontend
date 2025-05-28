import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { DateRangePickerValue } from '@mantine/dates';
import { createEvent } from 'effector';
import { ICity } from '@box/entities/city/model';

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    status: {
      init: null as ITabSelectValue<number> | null
    },
    logistStatus: {
      init: null as ITabSelectValue<number> | null
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    },
    shipping_city: {
      init: null as ISelectValue<ICity> | null
    },
    delivery_city: {
      init: null as ISelectValue<ICity> | null
    }
  }
});

const applyTableFilters = createEvent<void>();

export {
  filters,
  applyTableFilters
};
