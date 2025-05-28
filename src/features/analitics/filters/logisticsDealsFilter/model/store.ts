import { TimeframeTypes } from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    period: {
      init: TimeframeTypes[0] as ITabSelectValue | null
    },
    city: {
      init: null as ISelectValue | null
    },
    region: {
      init: null as ISelectValue | null
    },
  }
});

export {
  filters
};