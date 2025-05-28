import { ITransportApplicationModel } from "@box/entities/logistics/model";

export interface ITransportApplicationRow {
  application: ITransportApplicationModel;
  status: number | undefined;
  onClick: () => void;
}
