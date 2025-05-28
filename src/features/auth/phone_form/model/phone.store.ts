import { validationPipe, isNotEmptyString } from '@box/shared/effector-form-controller/validator';
import { createField, createForm } from '@box/shared/effector-form-controller';
import { isAxiosError, AxiosError } from 'axios';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { sample, createEffect, createStore } from 'effector';
import { authApi } from '@box/entities/auth';

interface IUserToSubmit {
  id: number,
  isCreated: boolean,
  phone: string
}

const phoneField = createField<string>({
  initialValue: '',
  validateFn: (val) => validationPipe(val, isNotEmptyString(), (val) => {
    if (val.length === 14) {
      return null;
    }
    throw new Error('');
  }),
});

const copyPhone = createField<string>({
  initialValue: '',
})

const policyField = createField<boolean>({
  initialValue: false,
  validateFn: (val) => validationPipe(val, (val) => {
    if (val) {
      return null;
    }

    throw new Error('Вы должны принять политику конфиденциальности');
  }),
});

const copyPolicy = createField<boolean>({
  initialValue: false,
})

const isBackField = createField<boolean>({
  initialValue: false,
})

const makeCallFx = createEffect<string, IUserToSubmit | void, AxiosError>({
  handler: async (phone) => {
    try {
      const { data } = await authApi.makeCall(phone.replace(/[()-]/g, ''));
      return data;
    } catch (e) {
      if (process.env.NEXT_PUBLIC_MODE === 'PRODUCTION') {
        if (isAxiosError(e)) {
          alert(e.response?.data[0]);
        }
        throw e;
      }
    }
  },
});

const $userToSubmit = createStore<IUserToSubmit | null>(null)
  .on(makeCallFx.doneData, (_, result) => result);

const waitingForCall = createLoaderStore(false, makeCallFx);

const phoneCallForm = createForm(phoneField, policyField);

sample({
  clock: phoneCallForm.formValid,
  source: phoneField.$value,
  target: makeCallFx,
});

export {
  $userToSubmit,
  phoneCallForm,
  phoneField,
  policyField,
  waitingForCall,
  makeCallFx,
  isBackField,
  copyPolicy,
  copyPhone
};
