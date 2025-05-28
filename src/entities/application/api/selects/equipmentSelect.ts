import { equiomentApplicationApi } from '@box/entities/application';

export const equipmentSelectApi = async () => {
  const { data } = await equiomentApplicationApi.getEquipmentCategory();
  return data.results.map((category) => ({
    id: category.id,
    label: category.name,
    value: category.id
  }))
};
