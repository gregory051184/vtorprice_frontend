import { ISelectValue } from '@box/shared/ui';
import { createForm } from '@box/shared/effector-forms';

const filters = createForm({
  fields: {
    company__recyclables__recyclables__category: {
      init: null as ISelectValue | null
    },
    search: {
      init: ''
    },
    company__city: {
      init: null as ISelectValue | null
    },
    collection_type: {
      init: null as ISelectValue | null
    }
  }
});

export {
  filters
};
