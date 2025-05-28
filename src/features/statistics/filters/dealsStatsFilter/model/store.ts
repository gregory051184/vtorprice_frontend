import { TimeframeTypes } from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    application__recyclables: {
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