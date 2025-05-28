import { applicationModel } from '@box/entities/application';
import { companyModel } from '@box/entities/company';
import { ITransportApplicationModel } from '@box/entities/logistics/model';

export interface IDealDocument {
  company?: number;
  id: number,
  name: string,
  document: string,
  contentType?: number,
  createdAt?: string,
  documentType?: {
    id: number,
    label: string
  },
}

export interface IDeal {
  id: number
  isDeleted: boolean
  createdAt: string
  withNds: boolean
  price: number
  isPackingDeduction: boolean
  packingDeductionType: number
  packingDeductionValue: number
  comment: string
  contentType: string
  dealNumber: string
  objectId?: number,
  status: {
    id: number
  }
  weight: number
  weediness: number
  moisture: number
  paymentTerm: {
    id: number
  }
  otherPaymentTerm: string
  loadedWeight: any
  acceptedWeight: any
  shippingDate: any
  deliveryDate: any
  whoDelivers: {
    id:number
  },
  documents: Array<IDealDocument>
  buyerPaysShipping: boolean
  shippingAddress: string
  shippingLatitude: any
  shippingLongitude: any
  deliveryAddress: string
  deliveryLatitude: any
  deliveryLongitude: any
  supplierCompany: companyModel.ICompany
  buyerCompany: companyModel.ICompany
  application: applicationModel.IRecyclableApplication
  shippingCity: any
  deliveryCity: any
  createdBy: number;
  chat: number;
  needReview: boolean
  transportApplication?: ITransportApplicationModel,
  totalPrice?: number
}

export enum DealStatus {
  NEW,
  AGREEMENT,
  LOGIST_ASSIGNMENT,
  LOADED,
  UNLOADED,
  FINAL,
  CLOSED,
  ARGUMENT,
  REJECTED
}

export enum TransportApplicationStatus {
  AGREEMENT = 1,
  LOADING,
  UNLOADING,
  COMPLETED,
  FINAL,
  CANCELED
}

export enum DealType {
  RECYCLABLES,
  TRANSPORT,
  EQUIPMENT
}

export enum DocumentTypeForDeals {
  UNLOADING_AGREMEENT = 1,
  AGREEMENT_APPLICATION = 2,
  WAYBILL = 3,
  INVOICE = 4,
  AGREEMENT_SPECIFICATION = 5,
  UNIFORM_TRANSPORTATION_DOCUMENT = 6,
  ACT = 7,
  INVOICE_DOCUMENT = 8,
}

export enum BuyOrSellDeals {
  BUY = 1,
  SELL = 2,
}