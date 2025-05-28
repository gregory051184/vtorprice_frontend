import { IWithClass } from "@types";
import { ICompany } from "../../../model";

export interface ICompanyCard extends IWithClass {
  company: ICompany;
  onClickInFavorite: (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
}
