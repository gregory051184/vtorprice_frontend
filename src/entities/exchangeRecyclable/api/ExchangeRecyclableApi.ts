import {AxiosResponse} from 'axios';
import {$host} from '@box/shared/api';
import {Paginationable} from '@types';
import {IExchangeRecyclable} from '../model/types';

type GetExchangeRecyclablesParams = {
    ordering?: string
    search: string,
    category: number,
    urgency_type: number
    page: number
};

type GetExchangeRecyclablesByCategoryParams = {
    category: number,
    urgency_type: number,
    applications__city__region: number,
    applications__city__region__district: number,
}

class ExchangeRecyclableApi {
    getExchangeRecyclables(params: Partial<GetExchangeRecyclablesParams>): Promise<AxiosResponse<{
        results: Array<IExchangeRecyclable>
    } & Paginationable>> {
        return $host.get('/exchange_recyclables/', {
            params
        });
    }

    getExchangeRecyclablesByCategory(params: GetExchangeRecyclablesByCategoryParams): Promise<AxiosResponse<Array<IExchangeRecyclable>>> {
        return $host.get('/exchange_recyclables/recyclables_by_category_without_pages/',
            {params}
        );
    }
}


export const exchangeRecyclableApi = new ExchangeRecyclableApi();
