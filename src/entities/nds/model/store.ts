import { createStore } from 'effector';
import { createEffect } from 'effector/effector.umd';
import { AxiosError } from 'axios';
import { $host } from '@box/shared/api';

const getNdsFx = createEffect<void, number, AxiosError>({
  handler: async () => {
    const { data } = await $host.get('/companies/nds_tax/');
    return data;
  }
});

const $nds = createStore<number>(0).on(getNdsFx.doneData, (_, data) => data);

export {
  $nds,
  getNdsFx
};
