import {ICompany} from "@box/entities/company/model";
import {IEquipmentApplication} from "@box/entities/application/model";

export interface IEquipmentProposal {
    id: number;
    isDeleted: boolean;
    sender_company: ICompany;
    companies: Array<ICompany>;
    applications: Array<IEquipmentApplication>;
    special_id: string;
    createdAt: Date;
}