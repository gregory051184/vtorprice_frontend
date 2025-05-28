import React from "react";
import {IWithClass} from "@types";
import {AppShell} from "@box/layouts";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {EquipmentProposalFormTemplate} from "@box/entities/equipment_proposal";

export const EquipmentProposal: React.FC<IWithClass> = ({}) => {

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <EquipmentProposalFormTemplate></EquipmentProposalFormTemplate>
        </AppShell>
    )
}