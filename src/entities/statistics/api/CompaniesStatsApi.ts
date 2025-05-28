import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { ICompaniesStatsData } from '../companiesStats/model/types';


class CompaniesStatsApi {
    getCompaniesStats():
    Promise<AxiosResponse<{
        results: ICompaniesStatsData
    }>> {
        return $host.get('/statistics/total_companies/');
    }
}

export const companiesStatsApi = new CompaniesStatsApi();