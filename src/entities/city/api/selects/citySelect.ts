import { ISelectValue } from "@box/shared/ui";
import { cityApi } from "@box/entities/city/api/CityApi";
import { ICity } from "../../model/types";

export const citySelectApi = async (
  search: string
): Promise<Array<ISelectValue<ICity>>> => {
  try {
    const { data } = await cityApi.getCities({
      search,
      size: 1000,
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
