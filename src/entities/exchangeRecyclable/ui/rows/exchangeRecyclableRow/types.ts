import { ITabSelectValue } from '@box/shared/ui';
import { IExchangeRecyclable } from '../../../model';

export interface IExchangeRecyclableRow {
  recyclable: IExchangeRecyclable
  onClick?: ()=>void
  selectedUrgencyType?: ITabSelectValue | undefined | null
}
