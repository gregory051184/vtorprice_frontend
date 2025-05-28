import { IUserWithRole } from "@box/entities/statistics/api/statisticApi";
import { ISelectValue } from "@box/shared/ui";
import { IWithClass } from "@box/types";

export interface IUserRoleCard extends IWithClass {
  user: IUserWithRole;
  onRoleChange: (val: ISelectValue<number> | null) => void;
}
