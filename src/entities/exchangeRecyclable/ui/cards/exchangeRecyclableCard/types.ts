import { IExchangeRecyclable } from '../../../model';

export interface IExchangeRecyclableCard {
  recyclable: IExchangeRecyclable
  onClick?: ()=>void
}
