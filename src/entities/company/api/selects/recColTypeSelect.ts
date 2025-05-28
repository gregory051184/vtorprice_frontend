import { ISelectValue } from '@box/shared/ui';
import { companyApi } from '@box/entities/company';
import { IRecColType } from '../../model/types';

type Args = {
  search: string,
  activityId: number
};

export const recColTypeSelectApi = async ({
  search,
  activityId
}: Args):
Promise<Array<ISelectValue<IRecColType>>> => {
  try {
    const { data } = await companyApi.getCompaniesRecColTypes({
      search,
      activity: activityId
    });

    return data.results.map((el) => ({
      id: el.id,
      label: el.name,
      value: el
    }));
  } catch {
    return [];
  }
};
