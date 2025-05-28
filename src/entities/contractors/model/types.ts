import { ICity } from '../../city/model/types';

export interface IContractor {
  id: number;
  isDeleted: boolean;
  createdAt: Date;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  contractorType: {
    id: number,
    label: string,
  };
  transportOwnsCount: number;
  avatarOrCompanyLogo: string;
  city: ICity;
  createdBy?: number;
  documents: Array<IContractorDocument>;
}

export interface IContractorDocumentResponse {
  address: string;
  contractorType: {
    id: number,
    label: string,
  };
  createdAt: Date;
  createdBy: number;
  id: number;
  isDeleted: boolean;
  name: string;
  transportOwnsCount: number;
  documents: Array<IContractorDocument>;
}

export interface IContractorDocument {
  id: number;
  isDeleted: boolean;
  contentType: number;
  createdAt: Date;
  document: string;
  name: string;
  objectId: number;
}
