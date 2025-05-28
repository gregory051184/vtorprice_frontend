import { IWithClass } from '@types';
import { ReactNode } from "react";
import { IRecyclableApplication } from "@box/entities/application/model";

export interface ICard extends IWithClass {
  application: IRecyclableApplication,
  deleteButton?: ReactNode
}
