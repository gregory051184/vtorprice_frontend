import { IWithClass } from '@types';

export interface IImagePicker extends IWithClass {
  onDelete?: ()=>void,
  onChange?: (file: File | null) => void,
  deletable?:boolean

  image:File | null | string
}
