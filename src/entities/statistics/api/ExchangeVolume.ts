import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IExchangeVolume } from '../exchangeVolume/model/types';

class ExchangeVolumeApi {
    getExchangeVolume():
    Promise<AxiosResponse<{
        results: IExchangeVolume
    }>> {
        return $host.get('/statistics/exchange_volume/');
    }
}

export const exchangeVolumeApi = new ExchangeVolumeApi();