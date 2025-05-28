import { ICompany } from '../../../model';
import {ReactNode} from "react";

export type  IChecking = {
  id: number;
  checked?: boolean;
  link?: string
}

export interface ICompanyRow {
  company: ICompany;
  onClickInFavorite: (
    id: number,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}


export interface ICompanyOfferRow {
  company: ICompany;
  checking?: Array<IChecking>;
  onChange?: (selected: any) => void
  favoriteButton?: ReactNode;
}