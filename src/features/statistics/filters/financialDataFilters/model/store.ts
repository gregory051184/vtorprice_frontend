import { createForm } from "@box/shared/effector-forms";

import { PERIOD, selectValues } from "@box/entities/statistics/api/selects";
import {ISelectValue, ITabSelectValue} from "@box/shared/ui";
import { DateRangePickerValue } from "@mantine/dates";

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    period: {
      init: selectValues[1] as ITabSelectValue<PERIOD>,
    },
    created_at: {
      init: [null, null] as DateRangePickerValue,
    },
    status: {
      init: null as ISelectValue<number> | null,
    },
  },
});

export { filters };
