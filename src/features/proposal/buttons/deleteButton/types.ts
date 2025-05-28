import { IWithClass } from "@types";
import { ReactElement } from "react";

export interface IProposalDeleteButton extends IWithClass {
    deleteProposal: (id: number) => Promise<number | null>;
    children: ReactElement;
    proposalId: number;
    proposalDate?: Date;
}