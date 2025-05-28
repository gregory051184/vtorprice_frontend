import { IWithClass } from '@types';
import { IStatus, ITransportApplicationModel } from '@box/entities/logistics/model';

export interface ITransportApplicationCard extends IWithClass {
  application: ITransportApplicationModel,
  status: {
    logistStatus: number | undefined;
    status: IStatus;
  };
  link: string;
}
