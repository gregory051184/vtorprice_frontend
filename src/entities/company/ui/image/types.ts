import { IWithClass } from '@types';

export interface IImage extends IWithClass {
  image?: File | null;
  onSelect?: (file: File | null) => void;
  onDelete?: () => void;
  loading?: boolean;
  name: string;
  nameWithImage: string;
}
