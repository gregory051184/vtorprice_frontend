import { AxiosResponse } from 'axios';
import { $host } from '@box/shared/api';
import {IDistrict} from '../model';

type GetDistrictsParams = {
    search?: string,
};
class DistrictApi {
    getDistricts(data: GetDistrictsParams): Promise<AxiosResponse<{
        results: Array<IDistrict>
    }>> {
        return $host.get('/districts/', {
            params: {
                search: data.search
            }
        });
    }
}

export const districtApi = new DistrictApi();
