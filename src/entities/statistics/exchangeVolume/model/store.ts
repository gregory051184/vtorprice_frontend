import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';

import {IExchangeVolume} from './types';
import {exchangeVolumeApi} from '../../api/ExchangeVolume';


const getExchangeVolumeFx = createEffect<
    Parameters<typeof exchangeVolumeApi.getExchangeVolume>
    , {
    data: Awaited<ReturnType<typeof exchangeVolumeApi.getExchangeVolume>>['data'],
}, AxiosError>({
    handler: async () => {
        const {data} = await exchangeVolumeApi.getExchangeVolume();
        return {
            data,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $exchangeVolume = createStore<IExchangeVolume>(null)
    .on(getExchangeVolumeFx.doneData, (_, data) => {
        return data.data;
    })

export {
    getExchangeVolumeFx,
    $exchangeVolume
};