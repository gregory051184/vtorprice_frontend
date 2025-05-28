import { createForm } from "@box/shared/effector-forms";

import { PERIOD, selectValues } from "@box/entities/statistics/api/selects";
import { ITabSelectValue } from "@box/shared/ui";
import { DateRangePickerValue } from "@mantine/dates";

const filters = createForm({
  fields: {
    period: {
      init: selectValues[0] as ITabSelectValue<PERIOD>,
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue,
    },
  },
});

export { filters };
