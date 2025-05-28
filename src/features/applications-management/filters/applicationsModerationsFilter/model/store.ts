import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { createEvent } from 'effector';
import { DateRangePickerValue } from "@mantine/dates";
import { applicationTypes } from '@box/entities/application';
import { groupTypes } from '@box/features/application/lib';

const applicationManagementTableFilters = createForm({
  fields: {
    search: {
      init: ''
    },
    created_at: {
      init: [null, null] as DateRangePickerValue
    },
    deal_type: {
      init: null as ISelectValue | null,
    },
    urgency_type: {
      init: applicationTypes[0] as ITabSelectValue,
    },
    recyclables: {
      init: null as ISelectValue | null
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    total_weight__gte: {
      init: ''
    },
    city: {
      init: null as ISelectValue | null
    },
    status: {
      init: groupTypes[0] as ITabSelectValue | null
    },
    company: {
      init: null as ISelectValue | null
    },
  }
});

const applyApplicationManagementTableFilters = createEvent<void>();

export {
  applicationManagementTableFilters,
  applyApplicationManagementTableFilters
};

const equipmentApplicationsManagementTableFilters = createForm({
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
    },
    company: {
      init: null as ISelectValue | null
    },
  }
});

const applyEquipmentApplicationManagementTableFilters = createEvent<void>();

export {
  equipmentApplicationsManagementTableFilters,
  applyEquipmentApplicationManagementTableFilters
};