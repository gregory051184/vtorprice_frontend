import React, {useEffect} from "react";
import {useStore} from "effector-react";
import {$proposal} from "@box/pages/profile/proposals/proposal";
import {BackButton, Container} from "@box/shared/ui";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell} from "@box/layouts";
import s from './styles.module.scss';
import {ProposalCompanyRow, ProposalRecyclableApplicationRow} from "@box/entities/proposal";

export const ProposalPage = () => {
    const proposal = useStore($proposal);
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
                                {proposal && proposal.companies.map(company => (
                                    <ProposalCompanyRow key={company.id} company={company} proposal={proposal}/>))}
                            </div>
                            <div className="mt-5 ml-72 w-[18vw]">
                                {proposal && proposal.applications.map((application) => (
                                    <ProposalRecyclableApplicationRow application={application} proposal={proposal}
                                                                      key={application.id}/>))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </AppShell>
    )
}