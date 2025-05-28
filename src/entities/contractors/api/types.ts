import { IContractor } from '../model/types';

export type CreateContractorParams = {
  name: string;
  address: string;
  transport_owns_count: number | null;
  latitude?: number;
  longitude?: number;
  contractor_type: number;
  city?: string;
  avatar_or_company_logo: File | null | undefined;
  // Добавил для документов
  documents?: FileList | null;
}; 

export type GetContractorsParams = {
  search?: string,
  city?: number,
  page?: number,
  size?: number,
  ordering?: string | null
};

export type UpdateContractorParams = Omit<IContractor, 'isDeleted' | 'createdAt' | 'createdBy'>;
