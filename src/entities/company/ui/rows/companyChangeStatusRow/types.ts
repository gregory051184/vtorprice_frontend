import {ICompany} from "@box/entities/company/model";
import {IAuthUser} from "@box/entities/auth";

export interface ICompanyChangeStatusRow {
    company: ICompany,
    user: IAuthUser
}