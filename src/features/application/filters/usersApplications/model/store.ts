 import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { createEvent } from 'effector';
import { applicationTypes, groupTypes } from '../../../lib';
import { DateRangePickerValue } from "@mantine/dates";
import {applicationRecyclableStatusSelectValues} from "@box/entities/application";

const usersApplicationTableFilters = createForm({
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
    application_recyclable_status: {
      init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null,
    },
    urgency_type: {
      init: applicationTypes[0] as ITabSelectValue | null as ISelectValue | null,
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
    }
  }
});

const applyUsersApplicationTableFilters = createEvent<void>();

export {
  usersApplicationTableFilters,
  applyUsersApplicationTableFilters
};
