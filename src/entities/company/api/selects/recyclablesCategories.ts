import { companyApi } from '@box/entities/company';
import { ISelectValue } from '@box/shared/ui';

// eslint-disable-next-line no-unused-vars
export const recyclablesCategoriesSelectApi = async (_: string): Promise<Array<ISelectValue>> => {
  try {
    const { data } = await companyApi.getRecyclablesCategories({size: 1000});
    return data.results.map((el) => ({
      id: el.id,
      label: el.name,
      value: el,
      isHeader: true,
      selectable: false,
      children: el.subcategories.map((type) => ({
        id: type.id,
        label: type.name,
        value: type
      }))
    }));
  } catch {
    return [];
  }
};

export const equipmentCategoriesSelectApi = async (_: string): Promise<Array<ISelectValue>> => {
  try {
    const { data } = await companyApi.getEquipmentCategories({size: 1000});
    return data.results.map((el) => ({
      id: el.id,
      label: el.name,
      value: el,
      isHeader: true,
      selectable: false,
      // @ts-ignore
      children: el.equipments.map((type) => ({
        id: type.id,
        label: type.name,
        value: type
      }))
    }));
  } catch {
    return [];
  }
};
