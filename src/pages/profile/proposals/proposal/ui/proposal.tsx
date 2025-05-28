
import React from "react";
import {IWithClass} from "@types";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@box/layouts";
import { CreateProposalForm } from "@box/features/proposal";

export const Proposal: React.FC<IWithClass> = ({}) => {

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <CreateProposalForm></CreateProposalForm>
        </AppShell>
    )
}