import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { Paginationable } from '@types';
import {IRecyclableApplicationPrice} from "@box/entities/statistics/recyclablesApplicationsPrices/model";


type GetRecyclablesApplicationsPricesParams = {
    period: string
};

class MainPageStatisticsApi {
    getStatisticsForMainPages(params: Partial<GetRecyclablesApplicationsPricesParams>):
        Promise<AxiosResponse<{
            results: Array<IRecyclableApplicationPrice>
        } & Paginationable>> {
        return $host.get('/statistics/main_page_statistics/', {
            params
        });
    }
}

export const mainPageStatisticsApi = new MainPageStatisticsApi();