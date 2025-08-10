import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { cityModel } from '@box/entities/city';
import { DateRangePickerValue } from '@mantine/dates';
import {applicationRecyclableStatusSelectValues} from "@box/entities/application";
import {IRegion} from "@box/entities/region/model";
import {IDistrict} from "@box/entities/district";

const filters = createForm({
  fields: {
    no_page: {
      init: false
    },
    city: {
      init: null as ISelectValue<cityModel.ICity> | null
    },
    region: {
      init: null as ISelectValue<IRegion> | null
    },
    district: {
      init: null as ISelectValue<IDistrict> | null
    },
    application_recyclable_status: {
      init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null
    },
    total_weight__gte: {
      init: ''
    },
    total_weight__lte: {
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
