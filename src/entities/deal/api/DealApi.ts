import { $authHost } from '@box/shared/api';
import {AxiosPromise} from 'axios';
import { DealStatus, IDeal } from '../model';
import { DealCreateParams } from './types';


class DealApi {
  create(data: DealCreateParams) {
    return $authHost.post('/recyclables_deals/', data);
  }

  update(id: number, data: Partial<DealCreateParams & { status?: DealStatus }>) {
    return $authHost.patch(`/recyclables_deals/${id}/`, data);
  }


  list(data: any): AxiosPromise<{
    results: Array<IDeal>
  }> {
    return $authHost.get('/recyclables_deals/', {
      params: data
    });
  }
  
  get(id: number): AxiosPromise<IDeal> {
    return $authHost.get(`/recyclables_deals/${id}/`);
  }

  deleteDocument(dealId: number, docId: number): number {
    $authHost.delete(`/recyclables_deals/${dealId}/delete_document/${docId}/`);
    return docId;
  }

  getDoc(url: string, id: number, docType: string): AxiosPromise<{ document: string }> {
    return $authHost.get(`/${url}/${id}/${docType}/`);
  }
}

export const dealApi = new DealApi();
