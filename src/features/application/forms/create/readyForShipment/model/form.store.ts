import { ISelectValue, ITabSelectValue } from '@box/shared/ui';
import { companyModel } from '@box/entities/company';
import { sample, createEffect } from 'effector';
import { AxiosError, AxiosResponse } from 'axios';
import Router from 'next/router';
import {
  applicationApi,
  applicationLib
} from '@box/entities/application';
import { notificationModel } from '@box/entities/notification';
import { $authStore } from '@box/entities/auth';
import { IRecyclableApplication } from '@box/entities/application/model';
import { ROLE } from '@box/types';
import { notVerificatedAlertModel } from '@box/entities/notVerificatedAlert/model';

export const {
  form: readyForShipmentForm,
  $totalWeight,
  $totalPrice
} = applicationLib.createReadyForShipmentForm();

const createReadyForShipmentApplicationFx = createEffect<{
  images: Array<File | null | string>,
  dealType: ITabSelectValue<number>,
  applicationRecyclableStatus: ITabSelectValue<number>,
  preferential: string,
  price: string,
  allVolume: string,
  withNds: boolean,
  kipVolume: string,
  kipWeight: string,
  weediness: number,
  moisture: number,
  recyclableType: ISelectValue<companyModel.ICompanyRecyclable['recyclables']> | null,
  address: string,
  latitude: number,
  longitude: number,
  city: number,
  company?: number,
  packing: ITabSelectValue<number>,
  packingTax: ITabSelectValue<number> | null,
  packingTaxVolume: string,
  comment: string,
  userRoleId?: number
}, Awaited<AxiosResponse<IRecyclableApplication>>, AxiosError>({
  handler: async (data) => {
    const response = await applicationApi.createApplication({
      deal_type: data.dealType.value as 1 | 2,
      application_recyclable_status: data.applicationRecyclableStatus.value as 1 | 2,
      urgency_type: 1,
      with_nds: data.withNds,
      bale_count: +data.kipVolume,
      ...(data.kipWeight && {bale_weight: (+data.kipWeight) * 1000}),
      price: +data.price,
      ...(data.allVolume && {full_weigth: (+data.allVolume) * 1000}),
      ...(data.preferential && {lot_size: (+data.preferential) * 1000}),
      is_packing_deduction: data.packing.value === 2,
      packing_deduction_type: data.packingTax?.value as 1 | 2,
      ...(data.packingTaxVolume && {packing_deduction_value: (+data.packingTaxVolume as 1 | 2) * 1000}),
      comment: data.comment,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      // @ts-ignore
      weediness: data.weediness,
      moisture: data.moisture,
      // @ts-ignore
      company: data.company?.id,
      recyclables: data.recyclableType?.value.id,
      images: data.images.filter((val) => val !== null) as Array<File | string>
    });
    Router.push('/');
    return response;
  }
});

const postReadyForShipmentImagesFx = createEffect<
{ id: number, images: Array<File | null | string> }
, { image: string } | null, AxiosError>({
  handler: async ({ id, images }) => {
    const { data } = await applicationApi.setApplicationImage(images, id);
    return data;
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
  clock: readyForShipmentForm?.formValidated,
  source: $authStore,
  fn: (src, clk) => ({
    ...clk,
    userRoleId: src.user?.role.id
  }),
  target: createReadyForShipmentApplicationFx
});

sample({
  clock: createReadyForShipmentApplicationFx.doneData,
  source: readyForShipmentForm?.$values,
  fn: (filters, response) => ({ id: response.data.id, images: filters.images }),
  target: postReadyForShipmentImagesFx
});

sample({
  clock: createReadyForShipmentApplicationFx.done,
  target: [readyForShipmentForm?.reset, notificationModel.showAlert.prepend(() => {
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
  clock: createReadyForShipmentApplicationFx.failData,
  target: notificationModel.showAlert.prepend((data) => {
    return({
      title: 'Ошибка',
      // @ts-ignore
      message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
    })
  })
});

sample({
  clock: readyForShipmentForm?.formValidated,
  target: notVerificatedAlertModel.openModalNotVerifEvent,
});