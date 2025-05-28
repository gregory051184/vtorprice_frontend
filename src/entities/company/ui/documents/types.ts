import { IWithClass } from '@types';

export interface IDocuments extends IWithClass {
  documents?: FileList | null;
  onAdd?: (files: FileList | null) => void;
  loading?: boolean;
  name: string;
}
