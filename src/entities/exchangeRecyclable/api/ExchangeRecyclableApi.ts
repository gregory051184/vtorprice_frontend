import { AxiosResponse } from 'axios';
import { $host } from '@box/shared/api';
import { Paginationable } from '@types';
import { IExchangeRecyclable } from '../model/types';

type GetExchangeRecyclablesParams = {
  ordering?: string
  //ДОБАВИЛ
  //deal_type?: number,
  search: string,
  category: number,
  urgency_type: number
  page: number
};
class ExchangeRecyclableApi {
  getExchangeRecyclables(params: Partial<GetExchangeRecyclablesParams>):Promise<AxiosResponse<{
    results: Array<IExchangeRecyclable>
  } & Paginationable>> {
    return $host.get('/exchange_recyclables/', {
      params
    });
  }
}

export const exchangeRecyclableApi = new ExchangeRecyclableApi();
