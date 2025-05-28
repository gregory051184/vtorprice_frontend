import React, {FormEventHandler, useEffect, useState} from 'react';
import {$authStore} from '@box/entities/auth';
import {useForm} from '@box/shared/effector-forms';
import {useEvent, useGate, useStore} from 'effector-react';
import {CompaniesForProposalRow} from "@box/entities/company";
import classNames from "classnames";
import s from "../../proposal/ui/style.module.scss";
import {BackButton, Button, Container, Loader, Table,} from "@box/shared/ui";
import {EquipmentApplicationCardForEquipmentProposal,} from "@box/entities/application";
import {$equipmentApplications, equipmentApplicationsLoading} from "@box/entities/application/model";
import {
    $favoritesCompaniesList,
    gate,
    favoriteCompaniesLoading
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";
import {useRouter} from "next/router";
import {createEquipmentProposalEvent, equipmentsProposalForm} from "@box/features/equipmetProposal/forms/create";
import {IEquipmentProposalForm} from "@box/entities/equipment_proposal";
import {$equipmentProposals,} from "@box/pages/profile/equipment_proposals";
import {gateEquipment} from "@box/widgets/applications/applicationsManagment/list/model/store";
import {useScreenSize} from "@box/shared/hooks";


export const EquipmentProposalFormTemplate: React.FC<IEquipmentProposalForm> = ({
                                                                                    className,
                                                                                    buttonText = 'Создать предложение'
                                                                                }) => {

    const {fields, submit, isValid, hasError, reset} = useForm(equipmentsProposalForm);
    const router = useRouter();
    const equipmentProposalEvent = useEvent(createEquipmentProposalEvent)

    const companies = useStore($favoritesCompaniesList);
    const {user} = useStore($authStore);
    const equipmentApplications = useStore($equipmentApplications);
    const appsLoading = useStore(equipmentApplicationsLoading.$loaderStore);
    const compLoading = useStore(favoriteCompaniesLoading.$loaderStore);
    const equipmentProposals = useStore($equipmentProposals);
    const currentUserEquipmentApplications = equipmentApplications.filter(application => application.company.id === user?.company.id);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const [selectedApplications, setSelectedApplications] = useState<Array<number>>([])

    const [selectedCompanies, setSelectedCompanies] = useState<Array<number>>([])

    const onSubmit: FormEventHandler = (ev) => {
        ev.preventDefault();
        //@ts-ignore
        fields.applications.onChange([...selectedApplications])
        //@ts-ignore
        fields.companies.onChange([...selectedCompanies])
        //Не работает запуск эффекта через form.formValidated
        equipmentProposalEvent();
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
    useGate(gateEquipment);

    useEffect(() => {
    }, [selectedCompanies, selectedApplications, equipmentProposals]);

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
                        {`Всего сформированных предложений по оборудованию: ${equipmentProposals.length}`}
                    </h3>
                    <div className={!isMobile ? "inline-flex" : ""}>
                        <div>
                            <h4 className="mt-5">Отметить организации для рассылки
                                предложений</h4>
                            <div
                                className={classNames("overflow-auto", !isMobile ? s.company_proposal_row : s.company_proposal_row_mobile)}>
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
                                            Чтобы у Вас появились компании для рассылки, нужно добавить компании в
                                            избранное
                                        </h4>
                                }
                            </div>
                        </div>
                        <div className={!isMobile ? "ml-24" : ""}>
                            <h4 className={!isMobile ? "ml-5 mt-5" : ""}>Отметить
                                объявления для формирования предложения</h4>
                            <div className={classNames("overflow-auto", !isMobile ? s.application_proposal_info : s.application_proposal_info_mobile)}>
                                {
                                    currentUserEquipmentApplications.length > 0 ?
                                        currentUserEquipmentApplications.map(application => (
                                            <EquipmentApplicationCardForEquipmentProposal
                                                onChange={handelCheckingApplications}
                                                className={s.card_view_card}
                                                key={application.id}
                                                application={application}
                                            />
                                        )) :
                                        <h4 className={s.alert_message}>
                                            Чтобы у Вас появились заявки для рассылки, нужно создать хотя бы одну
                                            заявку
                                        </h4>
                                }
                            </div>
                        </div>
                    </div>
                    <div className={classNames('mt-[4px] flex gap-[24px] items-center ', s.block, s.footer)}>
                        <Button disabled={!isValid} className={classNames('w-full', s.block_input)} htmlType="submit">
                            {buttonText}
                        </Button>
                    </div>
                </form>
            </Container>
        </div>
    );
}