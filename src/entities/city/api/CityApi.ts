import { AxiosResponse } from "axios";
import { $host } from "@box/shared/api";
import { ICity } from "../model";


type GetCitiesParams = {
  search?: string;
  size: number;
};

type GetCityParams = {
  id: number;
};

class CityApi {
  getCities(data: GetCitiesParams): Promise<
    AxiosResponse<{
      results: Array<ICity>;
    }>
  > {
    return $host.get("/cities/", {
      params: {
        search: data.search,
        size: data.size,
      },
    });
  }

  getCityInfo(data: GetCityParams): Promise<AxiosResponse<ICity>> {
    return $host.get(`/cities/${data.id}`);
  }
}

export const cityApi = new CityApi();
