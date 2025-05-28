import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { DateRangePickerValue } from '@mantine/dates';
import { createEvent } from 'effector';
import { groupTypes } from '../../../lib';

const usersEquipmentApplicationsTableFilters = createForm({
  fields: {
    search: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue | null,
    },
    created_at: {
      init: [null, null] as DateRangePickerValue
    },
    equipment: {
      init: null as ISelectValue | null
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    count: {
      init: ''
    },
    city: {
      init: null as ISelectValue | null
    },
    status: {
      init: groupTypes[0] as ITabSelectValue | null
    }
  }
});

const applyUsersEquipmentApplicationTableFilters = createEvent<void>();

export {
  usersEquipmentApplicationsTableFilters,
  applyUsersEquipmentApplicationTableFilters
};
