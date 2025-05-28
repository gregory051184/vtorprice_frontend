import { ISelectValue } from '@box/shared/ui';
import { createForm } from '@box/shared/effector-forms';
import { ICity } from '@box/entities/city/model';

const filters = createForm({
  fields: {
    search: {
      init: ''
    },
    city: {
      init: null as ISelectValue<ICity> | null
    }
  }
});

export { filters };
