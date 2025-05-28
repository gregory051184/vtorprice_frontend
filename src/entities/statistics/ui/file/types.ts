import { IWithClass } from '@types';

export interface IFile extends IWithClass {
  file?: string
  onSelect?: (file: File | null)=>void
  onDelete?: ()=>void
  loading?: boolean
  name: string
}
