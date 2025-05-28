import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { companyModel } from '@box/entities/company';
import { createEffect, sample } from 'effector';
import { AxiosError } from 'axios';
import { $authHost } from '@box/shared/api';
import Router from 'next/router';
import { applicationLib } from '@box/entities/application';
import { $authStore } from '@box/entities/auth';
import { notificationModel } from '@box/entities/notification';
import { ROLE } from '@box/types';
import { notVerificatedAlertModel } from '@box/entities/notVerificatedAlert/model';

export const { form: supplyContractForm, $totalPrice } = applicationLib.createSupplyContractForm();

const createSupplyContractApplicationFx = createEffect<{
  dealType: ITabSelectValue<number>,
  applicationRecyclableStatus: ITabSelectValue<number>,
  price: string,
  withNds: boolean,
  volume: string,
  recyclableType: ISelectValue<companyModel.ICompanyRecyclable['recyclables']> | null,
  address: string,
  latitude: number,
  longitude: number,
  company?: number,
  userRoleId?: number,
  city: number,
}, void, AxiosError>({
  handler: async (data) => {
    await $authHost.post('/recyclables_applications/', {
      deal_type: data.dealType.value,
      application_recyclable_status: data.applicationRecyclableStatus.value,
      urgency_type: 2,
      with_nds: data.withNds,
      //ЗАМЕНИЛ
      ...(data.price && { price: (+data.price).toString() }),
      ...(data.volume && { volume: ((+data.volume) * 1000).toString() }),
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      // @ts-ignore
      company: data.company?.id,
      recyclables: data.recyclableType?.value.id,
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    Router.push('/');
  }
});

const filtering = () => {
  const authStore = $authStore.getState();
  const filter = (authStore?.user?.role.id as ROLE === ROLE.MANAGER || 
    authStore?.user?.role.id as ROLE === ROLE.COMPANY_ADMIN) && 
    authStore?.user?.company?.status?.label === "Не проверенная"
    return filter;
}

sample({
  // @ts-ignore
  clock: supplyContractForm?.formValidated,
  source: $authStore,
  fn: (src, clk) => ({
    ...clk,
    userRoleId: src.user?.role.id
  }),
  target: createSupplyContractApplicationFx
});

sample({
  clock: createSupplyContractApplicationFx.done,
  target: [supplyContractForm?.reset, notificationModel.showAlert.prepend(() => {
    const authStore = $authStore.getState();

    return {
      title: authStore?.user?.company.status.id === 1
      ? "Заявка отправлена на модерацию"
      : "Успешно",
      message:
        authStore?.user?.company.status.id === 1
          ? "Заявка будет опубликована на сайте после проверки менеджером компании Вторпрайс.\n\nЧтобы публиковать заявки без проверки,  верифицируйте Вашу компанию в личном кабинете в разделе “Настройки”."
          : "Заявка опубликована",
    };
})],
});

sample({
  clock: createSupplyContractApplicationFx.failData,
  target: notificationModel.showAlert.prepend((data) => {
    return({
      title: 'Ошибка',
      // @ts-ignore
      message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
    })
  })
});

sample({
  clock: supplyContractForm?.formValidated,
  target: notVerificatedAlertModel.openModalNotVerifEvent,
});