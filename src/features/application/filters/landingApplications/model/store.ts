import { createForm } from '@box/shared/effector-forms';
import { IPillValue, ISelectValue } from '@box/shared/ui';
import { cityModel } from '@box/entities/city';
import { companyModel } from '@box/entities/company';
import { sample } from 'effector';
import {applicationRecyclableStatusSelectValues} from "@box/entities/application";

const filters = createForm({
  fields: {
    show_table: {
      init: false
    },
    deal_type: {
      init: null as ISelectValue<number> | null,
    },
    application_recyclable_status: {
      init: applicationRecyclableStatusSelectValues[0] as ISelectValue | null,
    },
    city: {
      init: null as ISelectValue<cityModel.ICity> | null,
    },
    total_weight: {
      init: null as ISelectValue<Array<number | undefined>> | null
    },
    urgency_type: {
      init: null as ISelectValue<number> | null
    },
    recyclables__category: {
      init: null as ISelectValue<{
        id: number,
        recyclables: Array<companyModel.ICompanyRecyclable['recyclables']>
      }> | null
    },
    recyclables: {
      init: [] as Array<IPillValue<companyModel.ICompanyRecyclable['recyclables']>>
    },
  },
});

sample({
  source: filters.fields.recyclables__category.$value,
  filter: (src) => src === null,
  target: filters.fields.recyclables.set.prepend(() => [])
});

export {
  filters
};
