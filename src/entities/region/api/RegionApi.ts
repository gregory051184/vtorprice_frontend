import { AxiosResponse } from 'axios';
import { $host } from '@box/shared/api';
import { IRegion } from '../model';

type GetRegionsParams = {
  search?: string,
};
class RegionApi {
  getRegions(data: GetRegionsParams): Promise<AxiosResponse<{
    results: Array<IRegion>
  }>> {
    return $host.get('/regions/', {
      params: {
        search: data.search
      }
    });
  }
}

export const regionApi = new RegionApi();
