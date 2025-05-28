import React from "react";
import {EquipmentProposalCompanyRowType} from "../lib/types";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";
import TrashIcon from "@assets/icons/24_delete.svg";
import {Avatar} from "@box/entities/user";
import {useUnit} from "effector-react";
import {updateEquipmentProposalFx} from "@box/pages/profile/equipment_proposals";

export const EquipmentProposalCompanyRow: React.FC<EquipmentProposalCompanyRowType> = ({
                                                                                           company,
                                                                                           proposal
                                                                                       }) => {
    const updateProposal = useUnit(updateEquipmentProposalFx);
    const removeCompanyFromProposalHandler = async (companyId: number) => {
        //@ts-ignore
        await updateProposal({company_id: companyId, id: proposal.id})
    }
    const router = useRouter();
    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';
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
            {
                //@ts-ignore
                proposal?.companies?.length >= 2 && <div
                onClick={() => removeCompanyFromProposalHandler(company?.id)}
                className="ml-8">
                <TrashIcon className="cursor-pointer" width={30} height={30}/>
            </div>
            }
        </div>
    )
}