import { AxiosResponse } from 'axios';
import { Paginationable } from '@types';
import { $authHost } from '@box/shared/api';
import {
  CreateTransportApplicationOffer, CreateTransportApplicationParams, 
  GetTransportApplicationsParams, IMyOffer, ITransportApplicationModel 
} from '../model';

export class LogisticsApplicationsApi {
  getApplications(params: Partial<GetTransportApplicationsParams>): Promise<AxiosResponse<{
    results: Array<ITransportApplicationModel>
  } & Paginationable>> {
    return $authHost.get('/transport_applications/', {
      params,
    });
  }

  getApplication(applicationId: number): Promise<AxiosResponse<ITransportApplicationModel>> {
    return $authHost.get(`/transport_applications/${applicationId}`);
  }

  createApplication(applicationData: CreateTransportApplicationParams):
  Promise<AxiosResponse<ITransportApplicationModel>> {
    return $authHost.post('/transport_applications/', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  createTransportApplicationOffer(id: number, offerData: CreateTransportApplicationOffer):
  Promise<AxiosResponse<IMyOffer>> {
    return $authHost.post(`/transport_applications/${id}/logistic_offers/`, offerData);
  }

  uppdataTransportApplicationOffer(idApplication: number,idOffer: number, offerData: CreateTransportApplicationOffer):
  Promise<AxiosResponse<IMyOffer>> {
    return $authHost.patch(`/transport_applications/${idApplication}/logistic_offers/${idOffer}/`, offerData);
  }
}

export const logisticsApplicationsApi = new LogisticsApplicationsApi();
