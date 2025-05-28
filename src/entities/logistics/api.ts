import { AxiosResponse } from 'axios';
import { IRecyclableApplication } from '@box/entities/application/model';
import { ExternalListParams, Paginationable } from '@types';
import { $authHost } from '@box/shared/api';
import { ITransportApplicationModel, IUpdateTransportApplicationParams } from './model';
import { AxiosPromise } from "axios/index";

type GetApplicationsParams = {
  search: string,
  city: number,
  company: string,
  status: number,
  is_favorite: boolean,
  size: number,
} & ExternalListParams;

export class LogisticsApplicationsApi {
  getApplications(params: Partial<GetApplicationsParams>): Promise<AxiosResponse<{
    results: Array<ITransportApplicationModel>
  } & Paginationable>> {
    return $authHost.get('/transport_applications/', {
      params,
    });
  }

  getApplication(applicationId: number): AxiosPromise<IRecyclableApplication>  {
    return $authHost.get(`/transport_applications/${applicationId}`);
  }

  updateTransportApplication(idApplication: number, params: IUpdateTransportApplicationParams): Promise<AxiosResponse<ITransportApplicationModel>> {
    return $authHost.patch(`/transport_applications/${idApplication}/`, params);
  }

  deleteDocument(dealId: number, docId: number): number {
    $authHost.delete(`/transport_applications/${dealId}/delete_document/${docId}/`);

    return docId;
  }
}

export const logisticsApplicationsApi = new LogisticsApplicationsApi();
