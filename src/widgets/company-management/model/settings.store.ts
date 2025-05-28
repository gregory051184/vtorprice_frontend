import { $authStore } from '@box/entities/auth';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { $authHost } from '@box/shared/api';
import {
  createEffect, combine, sample, createEvent
} from 'effector';
import { notificationModel } from '@box/entities/notification';
import { $company, getCompanyFx } from '@box/pages/companies/company/model/company.store';
import { companyInfoFormManagement } from '@box/features/company-management/company_info/model/form.store';
import { buyFormStateManagement } from '@box/features/company-management/recyclables_types/model/buy';
import { sellFormStateManagement } from '@box/features/company-management/recyclables_types/model/sell';
import { supplierFormStateManagement } from '@box/features/company-management/company_activity_types/model/supplier';
import { processorFormStateManagement } from '@box/features/company-management/company_activity_types/model/processor';
import { customerFormStateManagement } from '@box/features/company-management/company_activity_types/model/customer';

const submit = createEvent();
const loader = createLoaderStore(false);

const submitCompanyRecyclablesManagement = createEffect({
  // eslint-disable-next-line
  handler: async (data: any) => {
    const body = [];

    
    if (data.toBuyActive || data.toSellActive) {
      if (data.toBuyActive) {
        // eslint-disable-next-line no-restricted-syntax        
        for (const recyclable of Object.values(data.toBuy)) {
          // @ts-ignore
          const { monthlyVolume, price, recyclables } = recyclable;
          body.push({
            action: 1,
            ...(monthlyVolume && { monthlyVolume: ((+monthlyVolume) * 1000) }),
            price,
            company: $company.getState()?.id || 0,
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
            company: $company.getState()?.id || 0,
            recyclables: recyclables.id,
          });
        }
      }
      try {
        await $authHost.post('/company_recyclables/', body);        
      } catch (e) {
      }
    } else {
      const body2: any = [];
      try {
        const company = $company.getState()?.id || 0
        await $authHost.delete('/company_recyclables/delete_all_recyclables/', {
          params: {
            company: company
          }
        });
      } catch (e) {
        console.error(`varsToEndpoint: ${body2}`, 'Error:', e)
      };
    }
  },
});

sample({
  clock: submit,
  target: [companyInfoFormManagement.submit],
});

sample({
  clock: companyInfoFormManagement.formValid,
  target: buyFormStateManagement.submitForm,
});

sample({
  clock: buyFormStateManagement.submitFormFx.done,
  target: sellFormStateManagement.submitForm,
});

sample({
  clock: sellFormStateManagement.submitFormFx.done,
  source: combine({
    toBuy: buyFormStateManagement.form.$fields,
    toSell: sellFormStateManagement.form.$fields,
    toBuyActive: buyFormStateManagement.formActive.$value,
    toSellActive: sellFormStateManagement.formActive.$value,
  }),
  target: submitCompanyRecyclablesManagement,
});

sample({
  clock: submitCompanyRecyclablesManagement.pending,
  target: loader.api.startLoading,
});

sample({
  clock: submitCompanyRecyclablesManagement.finally,
  target: loader.api.stopLoading,
});
sample({
  clock: submitCompanyRecyclablesManagement.failData,
  target: loader.api.stopLoading,
});

sample({
  clock: submitCompanyRecyclablesManagement.doneData,
  target: supplierFormStateManagement.submitForm,
});
sample({
  clock: submitCompanyRecyclablesManagement.failData,
  target: supplierFormStateManagement.submitForm,
});
sample({
  clock: supplierFormStateManagement.updateCompanyRecColTypeFx.doneData,
  target: processorFormStateManagement.submitForm,
});
sample({
  clock: processorFormStateManagement.updateCompanyRecColTypeFx.doneData,
  target: customerFormStateManagement.submitForm,
});

sample({
  clock: customerFormStateManagement.updateCompanyRecColTypeFx.doneData,
  source: $company.map((val) => val?.id || 0),
  target: getCompanyFx,
});

sample({
  clock: customerFormStateManagement.updateCompanyRecColTypeFx.doneData,
  source: $authStore.map((val) => val.user?.company?.status),
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Ваша компания успешно отправлена на верификацию, дождитесь проверки.'
  }))
});
sample({
  clock: customerFormStateManagement.updateCompanyRecColTypeFx.doneData,
  source: $authStore.map((val) => val.user?.company?.status),
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Изменения сохранены'
  }))
});

export { submit, loader };
