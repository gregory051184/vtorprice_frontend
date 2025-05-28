import { IWithClass } from '@types';
import { ITransportApplicationModel } from '@box/entities/logistics/model';

export interface IActiveTransportApplicationCard extends IWithClass {
  application: ITransportApplicationModel,
}
