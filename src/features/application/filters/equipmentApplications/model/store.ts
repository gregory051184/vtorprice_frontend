import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { cityModel } from '@box/entities/city';
import { DateRangePickerValue } from '@mantine/dates';

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue<number> | null
    },
    equipment_type: {
      init: null as ISelectValue<number> | null
    },
    count: {
      init: '',
    },
    city: {
      init: null as ISelectValue<cityModel.ICity> | null
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    created_at: {
      init: [null, null] as DateRangePickerValue
    },
  },
});

export { filters };
