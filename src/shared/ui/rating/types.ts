import { IWithClass } from '@types';

export interface IRating extends IWithClass {
  rating: number,
  total: number,
  showOnlyStars?: boolean
}
