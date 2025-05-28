import { IStatus, ITransportApplicationModel } from "@box/entities/logistics/model";

export interface ITransportApplicationRow {
  application: ITransportApplicationModel;
  status: {
    logistStatus: number | undefined;
    status: IStatus;
  };
  onClick: () => void;
}
