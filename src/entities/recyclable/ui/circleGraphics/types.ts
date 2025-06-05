import { IWithClass } from '@types';
import { ICompanyRecyclable } from '@box/entities/company/model';
import {IRecyclableApplication} from "@box/entities/application/model";

export interface IRecyclableCircleGraphics extends IWithClass {
  recyclables: Array<IRecyclableApplication>//Array<ICompanyRecyclable>
}
