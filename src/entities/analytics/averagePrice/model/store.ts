import {
    createEffect, createStore
  } from 'effector';
import { AxiosError } from 'axios/index';

import { IAveragePriceResult } from './types';
import { averagePriceApi } from '../../api/AveragePriceApi';


const getAveragePriceFx = createEffect<
Parameters<typeof averagePriceApi.getAveragePrice>[0]
,{
  data: Awaited<ReturnType<typeof averagePriceApi.getAveragePrice>>['data'],
}, AxiosError>({
  handler: async (params) => {
    const { data } = await averagePriceApi.getAveragePrice(params);
    return {
      data,
    };
  }
});

// @ts-ignore
// eslint-disable-next-line
const $averagePrice = createStore<IAveragePriceResult>(null)
  .on(getAveragePriceFx.doneData, (_, data) => {
    return data.data;
  })

export {
    getAveragePriceFx,
    $averagePrice
};