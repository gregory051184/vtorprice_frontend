import { ISelectValue } from '@box/shared/ui';
import { IRegion } from '../../model/types';
import { regionApi } from '../RegionApi';

export const regionSelectApi = async (
  search: string
): Promise<Array<ISelectValue<IRegion>>> => {
  try {
    const { data } = await regionApi.getRegions({
      search,
    });
    return data.results.map((el) => ({
      id: el.id,
      label: el.name,
      value: el,
    }));
  } catch {
    return [];
  }
};
