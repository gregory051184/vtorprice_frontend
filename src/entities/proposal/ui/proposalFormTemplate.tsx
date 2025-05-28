import React, {FormEventHandler, useEffect, useState} from 'react';
import {IProposalForm, proposalForm} from "@box/entities/proposal";
import {$authStore} from '@box/entities/auth';
import dynamic from "next/dynamic";
import {useForm} from '@box/shared/effector-forms';
import {useEvent, useGate, useStore} from 'effector-react';
import {CompaniesForProposalRow} from "@box/entities/company";
import classNames from "classnames";
import s from "./style.module.scss";
import {BackButton, Button, Container, Loader, Table, Tip,} from "@box/shared/ui";
import {ApplicationCardForProposal,} from "@box/entities/application";
import {$applications, applicationsLoading} from "@box/entities/application/model";
import {
    $favoritesCompaniesList,
    gate,
    favoriteCompaniesLoading
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";
import {gate as appGate} from "@box/widgets/applications/applicationsVerificationsList/model";
import {createProposalEvent} from "@box/features/proposal/forms/create";
import {$proposals} from "@box/pages/profile/proposals/proposal";
import {useRouter} from "next/router";
import {useScreenSize} from "@box/shared/hooks";

const DynamicGeoSelect = dynamic(
    () => import('@box/shared/ui').then(module => module.GeoSelect),
    {ssr: false}
)

export const ProposalFormTemplate: React.FC<IProposalForm> = ({
                                                                  className,
                                                                  buttonText = 'Создать предложение'
                                                              }) => {

    const {
        fields, submit, isValid,
        hasError, reset
    } = useForm(proposalForm);
    const router = useRouter();
    const proposalEvent = useEvent(createProposalEvent)

    const companies = useStore($favoritesCompaniesList);
    const {user} = useStore($authStore);
    const applications = useStore($applications);
    const appsLoading = useStore(applicationsLoading.$loaderStore);
    const compLoading = useStore(favoriteCompaniesLoading.$loaderStore);
    const proposals = useStore($proposals);
    const currentUserApplications = applications.filter(application => application.company.id === user?.company.id);

    const [selectedApplications, setSelectedApplications] = useState<Array<number>>([]);

    const [selectedCompanies, setSelectedCompanies] = useState<Array<number>>([]);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();
        fields.applications.onChange([...selectedApplications])
        //@ts-ignore
        fields.companies.onChange([...selectedCompanies])
        //Не работает запуск эффекта через form.formValidated
        proposalEvent();
        submit();
    };

    const handelCheckingCompanies = (selected: number) => {
        if (selected && !selectedCompanies.includes(selected)) {
            setSelectedCompanies(current => [...current, selected])
        } else {
            //@ts-ignore
            const g = selectedApplications.filter(id => id !== +selected);
            setSelectedCompanies([...g])

        }
        return selectedCompanies
    }

    const handelCheckingApplications = (selected: number) => {
        if (selected && !selectedApplications.includes(selected)) {
            setSelectedApplications(current => [...current, selected])
        } else {
            //@ts-ignore
            const g = selectedApplications.filter(id => id !== +selected);
            setSelectedApplications([...g])

        }
        return selectedApplications
    }

    useGate(gate);
    useGate(appGate);

    useEffect(() => {
    }, [selectedCompanies, selectedApplications, proposals]);

    if (appsLoading || compLoading) {
        return <Loader center className="mt-44"/>
    }

    return (
        <div>
            <Container>
                <BackButton/>
                <form onSubmit={onSubmit} className={classNames('flex flex-col gap-[20px]', className)}>
                    <h3
                        className="mt-6 cursor-pointer"
                        onClick={() => router.push('/profile/favorites')}>
                        {`Всего сформированных предложений: ${proposals.length}`}
                    </h3>
                    <div className={!isMobile ? "inline-flex" : ""}>
                        <div>
                            <h4 className="mt-5">
                                <Tip>
                                    Отметить организации для рассылки предложений
                                </Tip>
                            </h4>
                            <div
                                className={classNames("overflow-auto overflow-x-hidden", !isMobile ? s.company_proposal_row : s.company_proposal_row_mobile)}>
                                {
                                    companies.length > 0 ? <Table.Body>
                                            {companies.map((company) => (
                                                <CompaniesForProposalRow
                                                    onChange={handelCheckingCompanies}
                                                    key={company.id}
                                                    company={company}
                                                />
                                            ))}
                                        </Table.Body> :
                                        <h4 className={s.alert_message}>
                                            <Tip>
                                                Чтобы у Вас появились компании для рассылки, нужно добавить компании в
                                                избранное
                                            </Tip>
                                        </h4>
                                }
                            </div>
                        </div>
                        <div className={!isMobile ? "ml-24" : ""}>
                            <h4 className={!isMobile ? "ml-5 mt-5" : ""}>
                                <Tip>
                                    Отметить объявления для формирования предложения
                                </Tip>
                            </h4>
                            <div
                                className={classNames("overflow-auto overflow-x-hidden", !isMobile ? s.application_proposal_info : s.application_proposal_info_mobile)}>
                                {
                                    currentUserApplications.length > 0 ?
                                        currentUserApplications.map(application => (
                                            <ApplicationCardForProposal
                                                onChange={handelCheckingApplications}
                                                className={s.card_view_card}
                                                key={application.id}
                                                application={application}
                                            />
                                        )) :
                                        <h4 className={s.alert_message}>
                                            <Tip>
                                                Чтобы у Вас появились заявки для рассылки, нужно создать хотя бы одну
                                                заявку
                                            </Tip>
                                        </h4>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
                        <Button
                            disabled={!isValid}
                            className={classNames('w-full', s.block_input)}
                            htmlType="submit">
                            {buttonText}
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    );
}