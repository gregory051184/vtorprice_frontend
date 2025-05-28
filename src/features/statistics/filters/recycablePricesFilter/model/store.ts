import { TimeframeTypes } from '@box/entities/application';
import { createForm } from '@box/shared/effector-forms';
import { ISelectValue, ITabSelectValue } from '@box/shared/ui';

const filters = createForm({
  fields: {
    //А ЗДЕСЬ НЕТ category, но есть category__parent, попробую добавить
    category: {
      init: null as ISelectValue | null
    },
    category__parent: {
      init: null as ISelectValue | null
    },
    applications__city: {
      init: null as ISelectValue | null
  },
    applications__urgency_type: {
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