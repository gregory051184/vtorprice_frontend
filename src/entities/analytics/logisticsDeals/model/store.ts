import {
    createEffect, createStore
  } from 'effector';
import { AxiosError } from 'axios/index';

import { ILogisticsDealsData } from './types';
import { logisticsDealsApi } from '../../api/LogisticsDealsApi';


const getLogisticsDealsFx = createEffect<
Parameters<typeof logisticsDealsApi.getLogisticsDeals>[0]
,{
  data: Awaited<ReturnType<typeof logisticsDealsApi.getLogisticsDeals>>['data'],
}, AxiosError>({
  handler: async (params) => {
    const { data } = await logisticsDealsApi.getLogisticsDeals(params);
    return {
      data,
    };
  }
});

// @ts-ignore
// eslint-disable-next-line
const $logisticsDeals = createStore<ILogisticsDealsData>(null)
  .on(getLogisticsDealsFx.doneData, (_, data) => {
    return data.data;
  })

export {
    getLogisticsDealsFx,
    $logisticsDeals
};