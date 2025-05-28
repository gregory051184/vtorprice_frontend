import { $authHost } from '@box/shared/api';
import { AxiosPromise } from 'axios';
import { ILogisticsOffer } from '../model';

export class LogisticsOfferApi {
  static list({ id, ...data }: any): AxiosPromise<{
    results: Array<ILogisticsOffer>
  }> {
    return $authHost.get(`transport_applications/${id}/logistic_offers/`, {
      params: data
    });
  }
}
