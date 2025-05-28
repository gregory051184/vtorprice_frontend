import {ICompany} from "@box/entities/company/model";
import {IRecyclableApplication} from "@box/entities/application/model";

export interface IProposal {
    id: number;
    isDeleted: boolean;
    sender_company: ICompany;
    companies: Array<ICompany>;
    applications: Array<IRecyclableApplication>;
    special_id: string;
    createdAt: Date;
}