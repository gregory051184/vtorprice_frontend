import { ISelectValue } from '@box/shared/ui';
import { $usersCompany } from '@box/entities/auth';
import { validationPipe, isNotNull, isNotEmptyString } from '@box/shared/effector-form-controller/validator';
import {
  combine, sample, createEvent, createEffect,
} from 'effector';
import { createField, createDynamicForm } from '@box/shared/effector-form-controller';

export const createRecyclablesFormState = (action: 1 | 2, sid: string) => {
  const formActive = createField<boolean>({
    initialValue: false,
  });

  const formRecyclablesServerData = $usersCompany.map(
    (state) => state?.recyclables.filter((recyclable) => recyclable.action.id === action)
  );

  const form = createDynamicForm<{
    recyclables: ISelectValue | null,
    monthlyVolume: string,
    price: string
  }>({
    initialValue: {
      firstField: {
        id: 'firstField',
        recyclables: null,
        monthlyVolume: '',
        price: '',
        removable: false,
      },
    },
    emptyValue: {
      recyclables: null,
      monthlyVolume: '',
      price: '',
    },
    validators: {
      recyclables: (val) => validationPipe(val, isNotNull()),
      monthlyVolume: (val) => validationPipe(val, isNotEmptyString()),
      price: (val) => validationPipe(val, isNotEmptyString()),
    },
    sid,
  });

  const submitForm = createEvent();
  const submitFormFx = createEffect<any, boolean, boolean>({
    handler: async ({
      checked,
      store,
    }) => {
      if (checked) {
        try {
          await form.validateFx(store);
        } catch {
          throw false;
        }
      }

      return true;
    },
  });

  sample({
    source: formRecyclablesServerData,
    fn: (source) => {
      if (source) {
        return source.reduce((acc, el, num) => ({
          ...acc,
          [el.id]: {
            id: el.id,
            recyclables: {
              id: el.recyclables.id,
              label: el.recyclables.name,
              value: el.recyclables,
            },
            monthlyVolume: (el.monthlyVolume / 1000).toFixed(1),
            price: el.price.toString(),
            removable: num !== 0,
          },
        }), {});
      }
      return [];
    },
    filter: formRecyclablesServerData.map((val) => (val ? val.length > 0 : false)),
    target: [form.setValues, formActive.setValue.prepend(() => true)],
  });

  sample({
    clock: submitForm,
    source: combine({
      checked: formActive.$value,
      store: form.$fields,
    }),
    target: submitFormFx,
  });

  return {
    form,
    submitForm,
    formActive,
    submitFormFx,
  };
};
