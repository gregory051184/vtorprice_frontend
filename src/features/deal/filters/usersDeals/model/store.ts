import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { DateRangePickerValue } from '@mantine/dates';
import { createEvent } from 'effector';

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue | null,
    },
    application__recyclables__category: {
      init: null as ISelectValue | null
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    status: {
      init: null as ISelectValue | null
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    }
  }
});

const equipmentFilters = createForm({
  fields: {
    search: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue | null,
    },
    application__equipment__category: {
      init: null as ISelectValue | null
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    status: {
      init: null as ISelectValue | null
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    }
  }
});

const applyUsersApplicationTableFilters = createEvent<void>();
const applyUsersEquipmentApplicationTableFilters = createEvent<void>();

export {
  filters,
  equipmentFilters,
  applyUsersApplicationTableFilters,
  applyUsersEquipmentApplicationTableFilters
};
