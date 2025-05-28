import { IRecyclableApplication } from '../../../model';

export interface IApplicationStockGlassRow {
  application: IRecyclableApplication,
  priceColor: 'red' | 'green'
  urgencyType?: string| null | undefined
}
