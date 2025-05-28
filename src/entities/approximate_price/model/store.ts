import {
    createEffect, createStore
  } from 'effector';
import { AxiosError } from 'axios/index';

import { IApproximatePriceResult } from './types';
import { approximatePriceApi } from '../api/ApproximatePriceAPI';



const getApproximatePriceFx = createEffect<
Parameters<typeof approximatePriceApi.getApproximatePrice>[0]
,{
  data: Awaited<ReturnType<typeof approximatePriceApi.getApproximatePrice>>['data'],
}, AxiosError>({
  handler: async (params) => {
    const { data } = await approximatePriceApi.getApproximatePrice(params);
    return {
      data,
    };
  }
});

// @ts-ignore
// eslint-disable-next-line
const $approximatePrice = createStore<IApproximatePriceResult>(null)
  .on(getApproximatePriceFx.doneData, (_, data) => {
    return data.data;
  })

export {
    getApproximatePriceFx,
    $approximatePrice
};