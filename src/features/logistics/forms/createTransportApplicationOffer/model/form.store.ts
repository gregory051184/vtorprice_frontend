import { createForm } from '@box/shared/effector-forms';
import { ISelectValue } from '@box/shared/ui';
import { createEvent} from 'effector';
import { createGate } from 'effector-react';

const gate = createGate();

const form = createForm({
  fields: {
    contractor: {
      init: null as ISelectValue<number> | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    uploadDate: {
      init: null as Date | null,
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    amount: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
  },
  validateOn: ['submit', 'change']
});

const applyForm = createEvent<'send' | 'change'>()

export { form, gate, applyForm };
