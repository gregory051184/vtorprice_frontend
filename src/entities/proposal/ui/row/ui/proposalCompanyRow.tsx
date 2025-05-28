import React from "react";
import {ProposalCompanyRowType} from "@box/entities/proposal/ui/row";
import {Avatar} from "@box/entities/user";
import TrashIcon from "@assets/icons/24_delete.svg";
import {useRouter} from "next/router";
import {useUnit} from "effector-react";
import {updateProposalFx} from "@box/pages/profile/proposals/proposal";

export const ProposalCompanyRow: React.FC<ProposalCompanyRowType> = ({
                                                                         company,
                                                                         proposal
                                                                     }) => {
    const updateProposal = useUnit(updateProposalFx);
    const router = useRouter();
    const removeCompanyFromProposalHandler = async (companyId: number) => {
        //@ts-ignore
        await updateProposal({company_id: companyId, id: proposal.id})
    }

    return (
        <div
            className="inline-flex mt-3">
            <div
                onClick={() => router.push(`/companies/${company.id}`)}
                className="inline-flex">
                <div>
                    <Avatar className="shrink-0" size="sm" url={company?.image || null}/>

                </div>
                <p className="ml-3 w-[6vw]">{company.name}</p>
                <p className="ml-3 w-[11vw]">
                    {company.address}
                </p>
            </div>
            {proposal.companies.length >= 2 && <div
                onClick={() => removeCompanyFromProposalHandler(company?.id)}
                className="ml-8">
                <TrashIcon className="cursor-pointer" width={30} height={30}/>
            </div>
            }
        </div>
    )
}