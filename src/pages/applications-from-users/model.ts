import { notificationModel } from '@box/entities/notification';
import { $authHost } from '@box/shared/api';
import { applicationsFromUsersListsModel } from '@box/widgets/applications';
import { AxiosError } from 'axios';
import {
  combine, createEffect, createEvent, sample, Store 
} from 'effector';

const createDealEvent = createEvent();

const createDealsFx = createEffect<[number, number], AxiosError>({
  handler: async ([id1, id2]) => {
    const { data } = await $authHost.post('/recyclables_applications/match_applications/', {
      buying_id: id2,
      selling_id: id1
    });

    return data;
  }
});

sample({
  clock: createDealEvent,
  source: combine([
    applicationsFromUsersListsModel.sales.selected,
    applicationsFromUsersListsModel.purchase.selected 
  ]) as Store<[number, number]>,
  filter: (src) => src[0] !== null && src[1] !== null,
  target: createDealsFx
});

sample({
  clock: createDealsFx.doneData,
  target: notificationModel.showAlert.prepend(() => ({
    title: 'Успешно',
    message: 'Сделка успешно создана'
  }))
});

sample({
  clock: createDealsFx.failData,
  target: notificationModel.showAlert.prepend((data) => {
    return({
      title: 'Ошибка',
      // @ts-ignore
      message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
    })
  })
});

export {
  createDealEvent
};
