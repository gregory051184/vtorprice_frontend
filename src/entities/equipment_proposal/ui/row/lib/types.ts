import {IEquipmentApplication} from "@box/entities/application/model";
import {ICompany} from "@box/entities/company/model";
import {IEquipmentProposal} from "@box/entities/equipment_proposal";

export type EquipmentProposalRowType = {
    application: IEquipmentApplication;
    proposal?: IEquipmentProposal;
}

export type EquipmentProposalCompanyRowType = {
    company: ICompany;
    proposal?: IEquipmentProposal;
}