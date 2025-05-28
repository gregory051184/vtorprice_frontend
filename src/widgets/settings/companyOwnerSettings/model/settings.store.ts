import { TStatus } from '@box/types';
import { AxiosError } from 'axios';
import { getMeFx, $authStore } from '@box/entities/auth';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { $authHost } from '@box/shared/api';
import {
  createEffect, combine, sample, createEvent
} from 'effector';
import {
  customerFormState,
  supplierFormState,
  processorFormState,
} from '@box/features/settings/company_activity_types';

import {
  sellFormState,
  buyFormState,
} from '@box/features/settings/recyclables_types';
import { companyInfoForm } from '@box/features/settings/company_info';
import { userInfoForm } from '@box/features/settings/user_info';
import { notificationModel } from '@box/entities/notification';

const submit = createEvent();
const loader = createLoaderStore(false);

const submitCompanyRecyclables = createEffect({
  // eslint-disable-next-line
  handler: async (data: any) => {
    const body = [];
    if (data.toBuyActive) {
      // eslint-disable-next-line no-restricted-syntax
      for (const recyclable of Object.values(data.toBuy)) {
        // @ts-ignore
        const { monthlyVolume, price, recyclables } = recyclable;

        body.push({
          action: 1,
          ...(monthlyVolume && { monthlyVolume: ((+monthlyVolume) * 1000) }),
          price,
          recyclables: recyclables.id,
        });
      }
    }
    if (data.toSellActive) {
      // eslint-disable-next-line no-restricted-syntax
      for (const recyclable of Object.values(data.toSell)) {
        // @ts-ignore
        const { monthlyVolume, price, recyclables } = recyclable;
        body.push({
          action: 2,
          ...(monthlyVolume && { monthlyVolume: ((+monthlyVolume) * 1000) }),
          price,
          recyclables: recyclables.id,
        });
      }
    }
    await $authHost.post('/company_recyclables/', body);
  },
});

sample({
  clock: submit,
  target: [companyInfoForm.submit],
});

sample({
  clock: companyInfoForm.formValid,
  target: userInfoForm.submit,
});

sample({
  clock: userInfoForm.formValid,
  target: buyFormState.submitForm,
});

sample({
  clock: buyFormState.submitFormFx.done,
  target: sellFormState.submitForm,
});

sample({
  clock: sellFormState.submitFormFx.done,
  source: combine({
    toBuy: buyFormState.form.$fields,
    toSell: sellFormState.form.$fields,
    toBuyActive: buyFormState.formActive.$value,
    toSellActive: sellFormState.formActive.$value,
  }),
  target: submitCompanyRecyclables,
});

sample({
  clock: submitCompanyRecyclables.pending,
  target: loader.api.startLoading,
});

sample({
  clock: submitCompanyRecyclables.finally,
  target: loader.api.stopLoading,
});

sample({
  clock: submitCompanyRecyclables.doneData,
  target: supplierFormState.submitForm,
});

sample({
  clock: supplierFormState.updateCompanyRecColTypeFx.doneData,
  target: processorFormState.submitForm,
});

sample({
  clock: processorFormState.updateCompanyRecColTypeFx.doneData,
  target: customerFormState.submitForm,
});

const sendOnVerificationFx = createEffect<
TStatus | undefined,
TStatus | undefined,
AxiosError
>(async (status) => {
  await $authHost.post('/company_verification/');
  return status;
});

sample({
  clock: customerFormState.updateCompanyRecColTypeFx.doneData,
  source: $authStore.map((val) => val.user?.company?.status),
  target: [sendOnVerificationFx, getMeFx],
});

sample({
  source: sendOnVerificationFx.done,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Ваша компания успешно отправлена на верификацию, дождитесь проверки.'
  }))
});

sample({
  source: sendOnVerificationFx.failData,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Изменения сохранены'
  }))
});

export { submit, loader };
