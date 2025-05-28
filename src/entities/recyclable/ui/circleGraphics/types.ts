import { IWithClass } from '@types';
import { ICompanyRecyclable } from '@box/entities/company/model';

export interface IRecyclableCircleGraphics extends IWithClass {
  recyclables: Array<ICompanyRecyclable>
}
