import { TimeframeTypes } from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    category: {
      init: null as ISelectValue | null
    },
    city: {
      init: null as ISelectValue | null
    },
    urgency_type: {
        init: null as ISelectValue | null
    },
    deal_type: {
      init: null as ISelectValue | null
    },
    period: {
      init: TimeframeTypes[0] as ITabSelectValue | null
    },
  }
});

export {
  filters
};