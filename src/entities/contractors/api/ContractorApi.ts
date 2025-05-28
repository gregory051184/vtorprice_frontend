import { $authHost, $host } from '@box/shared/api';
import { AxiosResponse } from 'axios';
import { Paginationable } from '@types';
import {
  CreateContractorParams, GetContractorsParams, UpdateContractorParams 
} from './types';

import { IContractor, IContractorDocumentResponse } from '../model';

class ContractorApi {
  getContractors(data: GetContractorsParams): Promise<AxiosResponse<{
    results:Array<IContractor>
  } & Paginationable>> {
    return $authHost.get('/contractors/', {
      params: data
    });
  }

  getContractor(id: number): Promise<AxiosResponse<IContractor>> {
    return $host.get(`/contractors/${id}/`);
  }

  createContractor(contractorData: CreateContractorParams): Promise<AxiosResponse<IContractor>> {
    const formData = new FormData();
    const keys = Object.keys(contractorData);

    // Iterate all Fields from Form
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof CreateContractorParams;

      if (contractorData[key] != null) {
        // @ts-ignore
        formData.append(key, contractorData[key]);
      }
    }
    return $authHost.post('/contractors/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  postContractorDocument(id: number, contractorDocument: File): Promise<
  AxiosResponse<IContractorDocumentResponse>> {
    const formData = new FormData();
    formData.append('document', contractorDocument);
    formData.append('name', contractorDocument.name);

    return $authHost.post(`/contractors/${id}/add_documents/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  updateContractor(id: number, contractorData: UpdateContractorParams): Promise<
  AxiosResponse<IContractor>> {
    return $authHost.post(`/contractors/${id}`, contractorData);
  }

  deleteContractor(id: number): Promise<AxiosResponse<IContractor>> {
    return $authHost.delete(`/contractors/${id}`);
  }
}

export const contractorApi = new ContractorApi();
