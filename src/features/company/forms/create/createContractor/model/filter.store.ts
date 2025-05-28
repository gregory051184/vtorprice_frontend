import { ISelectValue } from '@box/shared/ui';
import { createForm } from '@box/shared/effector-forms';
import { createEvent, createStore } from 'effector';
import { contractorsType } from '@box/entities/contractors';

const form = createForm({
  fields: {
    contractor_type: {
      init: contractorsType[0] as ISelectValue<number> | null
    },
    name: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    address: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val.length > 0
        }
      ]
    },
    latitude: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => !!val
        }
      ]
    },
    longitude: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => !!val
        }
      ]
    },
    transport_owns_count: {
      init: '',
      rules: [
        {
          name: 'not_null',
          validator: (val) => val != null
        }
      ]
    },
    avatar_or_company_logo: {
      init: null as File | null
    },
    document: {
      init: null as FileList | null
    }
  },
  validateOn: ['change', 'submit']
});

const toggle = createEvent();
const $formOpen = createStore(false)
  .on(toggle, (state) => !state)
  .on(form?.formValidated, (state) => !state);

export {
  form, $formOpen, toggle
};
