import { $authHost } from "@box/shared/api";
import { AxiosPromise } from "axios";

class EquipmentDeals {
  create(data: any) {
    return $authHost.post('/equipment_deals/', data);
  }

  get(id: number): AxiosPromise {
    return $authHost.get(`/equipment_deals/${id}/`)
  }

  update(id: number, data: any): AxiosPromise {
    return $authHost.patch(`/equipment_deals/${id}/`, data)
  }

  deleteDocument(dealId: number, docId: number): number {
    $authHost.delete(`/equipment_deals/${dealId}/delete_document/${docId}/`);

    return docId;
  }

  list(data: any): AxiosPromise {
    return $authHost.get('/equipment_deals/', {
      params: data
    });
  }
}

export const equipmentDealsApi = new EquipmentDeals();
