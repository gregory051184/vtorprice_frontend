import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { cityModel } from '@box/entities/city';
import { DateRangePickerValue } from '@mantine/dates';
import {applicationRecyclableStatusSelectValues} from "@box/entities/application";

const filters = createForm({
  fields: {
    no_page: {
      init: false
    },
    city: {
      init: null as ISelectValue<cityModel.ICity> | null,
    },
    application_recyclable_status: {
      init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null,
    },
    total_weight__gte: {
      init: ''
    },
    price__gte: {
      init: ''
    },
    price__lte: {
      init: ''
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    },
    urgency_type: {
      init: null as number | null
    }
  },
});

export {
  filters
};
