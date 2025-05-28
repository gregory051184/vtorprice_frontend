import { createForm } from "@box/shared/effector-forms";
import { ITabSelectValue } from "@box/shared/ui";
import { DateRangePickerValue } from "@mantine/dates";
import { createEvent } from "effector";

const filters = createForm({
  fields: {
    search: {
      init: "",
    },
    status: {
      init: null as ITabSelectValue<number> | null
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue,
    },
    price__gte: {
      init: "",
    },
    price__lte: {
      init: "",
    },
  },
});

const applyTableFilters = createEvent<void>();

export { filters, applyTableFilters };
