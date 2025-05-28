import { IWithClass } from '@types';
import { ICompanyDocument } from '../../model/types';

export interface IFile extends IWithClass {
  file?: ICompanyDocument | null
  onSelect?: (file: File | null)=>void
  onDelete?: (id: number)=>void
  loading?: boolean
  name: string,
  accept?: string
}
