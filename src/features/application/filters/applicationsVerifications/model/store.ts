import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { DateRangePickerValue } from '@mantine/dates';
import { createEvent } from 'effector';
import {applicationRecyclableStatusSelectValues} from "@box/entities/application";

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    deal_type: {
      init: null as ISelectValue | null,
    },
    application_recyclable_status: {
      init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null,
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
    total_weight__lte: {
      init: ''
    },
    city: {
      init: null as ISelectValue | null
    },
    status: {
      init: null as ISelectValue | null
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    }
  }
});

const applyApplicationsVerificationTableFilters = createEvent<void>();

export {
  filters,
  applyApplicationsVerificationTableFilters
};
