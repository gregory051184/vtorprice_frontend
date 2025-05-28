import {ICompany} from "@box/entities/company/model";
import {IProposal} from "@box/entities/proposal";
import {IRecyclableApplication} from "@box/entities/application/model";

export type ProposalCompanyRowType = {
    company: ICompany;
    proposal: IProposal;
}

export type ProposalRecyclableApplicationRowType = {
    application: IRecyclableApplication;
    proposal?: IProposal;
}