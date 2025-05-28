import { IContractor } from '@box/entities/contractors/model';

export interface ICompanyRow {
  company: IContractor;
  documents: React.ReactNode;
}
