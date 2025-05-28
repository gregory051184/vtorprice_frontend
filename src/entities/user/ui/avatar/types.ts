import { IWithClass } from '@types';
import { sizes } from './lib/sizes';

export interface IAvatar extends IWithClass {
  size: keyof typeof sizes
  url: string | unknown
  loading?: boolean
}
