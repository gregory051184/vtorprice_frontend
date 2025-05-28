import { ISelectValue } from '@box/shared/ui';
import { createForm } from '@box/shared/effector-forms';
import { DateRangePickerValue } from '@mantine/dates';
import { ICity } from '@box/entities/city/model';
import { IRecyclable } from '@box/entities/recyclable/model';
import { createEvent } from 'effector';
import { companyModel } from '@box/entities/company';

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    createdAt: {
      init: [null, null] as DateRangePickerValue
    },
    activity_types__rec_col_types: {
      init: null as ISelectValue<companyModel.IRecColType> | null
    },
    recyclables: {
      init: null as ISelectValue<IRecyclable> | null
    },
    company__city: {
      init: null as ISelectValue<ICity> | null
    }
  }
});

const applyFavoritesFilters = createEvent();

export {
  filters,
  applyFavoritesFilters
};
