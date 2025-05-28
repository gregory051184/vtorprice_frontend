import {AxiosResponse} from 'axios/index';
import {$host} from '@box/shared/api';
import {Paginationable} from '@types';
import {
    IRecyclableApplicationPrice, IShortRecyclableApplicationPrice,
} from "@box/entities/statistics/recyclablesApplicationsPrices/model";


type GetShortRecyclablesApplicationsPricesParams = {
    period: string,
    deal_type: number,
    page: number,
}

type GetRecyclablesApplicationsPricesParams = {
    category: string,
    applications__city: string,
    applications__urgency_type: string,
    application_recyclable_status: string,
    category__parent: number
    page: number,
    period: string
    //ДОБАВИЛ
    deal_type: number;
};

class RecyclablesApplicationsPricesApi {
    getCompaniesVerifications(params: Partial<GetRecyclablesApplicationsPricesParams>):
        Promise<AxiosResponse<{
            results: Array<IRecyclableApplicationPrice>
        } & Paginationable>> {
        return $host.get('/statistics/recyclables_applications_price/', {
            params
        });
    }

    getShortRecyclableApplicationsPrice(params: Partial<GetShortRecyclablesApplicationsPricesParams>):
        Promise<AxiosResponse<{
            results: Array<IShortRecyclableApplicationPrice>
        } & Paginationable>> {
        return $host.get('/statistics/short_recyclables_applications_price/', {
            params
        });
    }
}

export const recyclablesApplicationsPricesApi = new RecyclablesApplicationsPricesApi();