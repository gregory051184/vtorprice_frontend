import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {BackButton, Container} from "@box/shared/ui";
import s from "@box/pages/profile/profile-proposal/proposal/ui/styles.module.scss";
import {AppShell} from "@box/layouts";
import React, {useEffect} from "react";
import {useStore} from "effector-react";
import {$equipmentProposal} from "@box/pages/profile/equipment_proposals";
import {EquipmentProposalCompanyRow} from "@box/entities/equipment_proposal";
import {
    EquipmentProposalApplicationRow
} from "@box/entities/equipment_proposal/ui/row/ui/equipmentProposalApplicationRow";

export const EquipmentProposalPage = () => {
    const proposal = useStore($equipmentProposal);
    useEffect(() => {
    }, [proposal]);
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Container>
                <BackButton/>
                <div className="mt-6 h-auto">
                    <div className={s.proposal}>
                        <h3 className={s.title}>Ваше предложение для редактирования</h3>
                        <div className="mt-5 inline-flex">
                            <h4 className="ml-[7vw]">Организации</h4>
                            <h4 className="ml-[19vw]">Ваши объявления в предложение</h4>
                        </div>
                        <div className="mt-5 inline-flex">
                            <div className="mt-5 w-[18vw]">
                                {proposal && proposal?.companies.map(company => (
                                    <EquipmentProposalCompanyRow key={company.id} company={company}
                                                                 proposal={proposal}/>))}
                            </div>
                            <div className="mt-5 ml-72 w-[18vw]">
                                {proposal && proposal?.applications.map((application) => (
                                    <EquipmentProposalApplicationRow application={application} proposal={proposal}
                                                                     key={application.id}/>))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </AppShell>
    )
}