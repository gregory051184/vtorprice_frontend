import { $authHost } from '@box/shared/api';
import { IGeocode } from "./types";

const geocodeSelectApi = async (raw_address: string):
  Promise<Array<IGeocode>> => {
  try {
    const { data } = await $authHost.get('/services/geocode/', {
      params: {
        raw_address
      }
    });

    return data
  } catch {
    return [];
  }
}

export { geocodeSelectApi };
