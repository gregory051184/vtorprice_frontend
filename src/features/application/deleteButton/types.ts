import { IWithClass } from "@types";
import { ReactElement } from "react";

export interface IApplicationDeleteButton extends IWithClass {
  deleteApplication: (id: number) => Promise<number | null>;
  children: ReactElement;
  applicationId: number;
  aplicationType?: string;
  applicationDate?: Date;
}
