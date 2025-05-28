import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    shipping_city: {
      init: null as ISelectValue | null
    },
    delivery_city: {
      init: null as ISelectValue | null
    },
  }
});

export {
  filters
};