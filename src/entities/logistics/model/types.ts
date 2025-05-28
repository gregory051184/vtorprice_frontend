import { IChatResult } from '@box/entities/chat/model/chat.model';
import { ICity } from '@box/entities/city/model';
import { IContractor } from '@box/entities/contractors/model';

export type GetTransportApplicationsParams = {
  search: string,
  created_at__gte: Date,
  created_at__lte: Date,
  status: Array<number>,
  logistStatus: Array<number>,
  shipping_city: string,
  delivery_city: string,
  approved_logistics_offer__amount__gte: string,
  approved_logistics_offer__amount__lte: string,
  created_by: string,
  ordering: string | null,
  page: number,
  size: number,
};
  
export type CreateTransportApplicationParams = {
  dealType?: string,
  shippingAddress?: string;
  shippingLatitude?: number;
  shippingLongitude?: number;
  deliveryAddress?: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  status?: number;
  loadingHours?: string;
  weekendWork?: boolean;
  comment?: string;
  objectId?: number;
  deliveryCity?: number;
  shippingCity?: number;
  sender: string;
  recipient: string;
  cargoType: string;
  loadingType: number;
  weight: number;
  senderPhone?: string;
};
  
export type CreateTransportApplicationOffer = {
  amount?: number;
  shippingDate: string;
  contractor: number;   
};

// chat interface 
export interface ITransportApplicationModel {
  id: number;
  dealType?: string;
  createdAt: string;
  shippingCity: ICity;
  deliveryCity: ICity;
  logistStatus?: 1 | 2 | 3 | 4;
  status: IStatus;
  shippingAddress: string;
  shippingLatitude: number;
  shippingLongitude: number;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  sender: string;
  senderPhone: string;
  recipient: string;
  myOffer?: IMyOffer;
  approvedLogisticsOffer?: IMyOffer;
  cargoType: string;
  loadingType: IStatus;
  weight: number;
  loadingHours: string;
  weekendWork: boolean;
  comment: string;
  objectId: number;
  createdBy: number;
  contentType: string;
  amount: number;
  shippingDate: string;
}

export interface IUpdateTransportApplicationParams {
  deal: {
    delivery_date?: string,
    accepted_weight?: number,
    shipping_date?: string,
    loaded_weight?: number,
  },
  delivery_date?: string,
  accepted_weight?: number,
  shipping_date?: string,
  loaded_weight?: number,
  status: number;
}

export interface IMyOffer {
  amount: number;
  chat: IChatResult;
  contractor: IContractor;
  application: ITransportApplicationModel;
  createdAt: Date;
  id: number;
  isDeleted:boolean;
  logist: {
    first_name: string,
    last_name: string,
    middle_name: string,
    firstName?: string,
    lastName?: string,
    middleName?: string,
    phone: string,
    id: number
  };
  name: string;
  shippingDate: Date;
  status: IStatus;
}
  
export interface IStatus {
  id: number;
  label: string;
}
