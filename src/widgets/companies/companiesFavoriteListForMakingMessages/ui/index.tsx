import React, {useEffect, useState} from "react";
import {IWithClass} from "@types";
import {useGate, useStore, useUnit} from "effector-react";
import {useOrdering, usePagination} from "@box/shared/lib/factories";
import {Button, Loader, Modal, Pagination, Table} from "@box/shared/ui";
import s from "@box/widgets/companies/companiesList/ui/style.module.scss";
import {CompanyCard, CompanyFavoritesRow} from '@box/entities/company';
import classNames from "classnames";
import {useRouter} from "next/router";
import {
    $favoritesCompaniesList,
    favoriteCompaniesLoading,
    updateCompanyInFavoriteFx,
    gate, ordering, pagination, headers
} from "@box/widgets/companies/companiesFavoriteListForMakingMessages";
import {UsersFavoritesCompaniesListFilters} from "@box/features/company/filters/copmaniesFavorites";
import {useScreenSize} from "@box/shared/hooks";
import StarImg from "@box/shared/ui/starImg";
import {ProposalList} from "@box/pages/profile/profile-proposal";
import {$proposals, gate as proposalsGate} from "@box/pages/profile/proposals/proposal";
import {proposalApi, SendCompanyProposalsByEmail} from "@box/entities/proposal";
import {$equipmentProposals, gate as equipmentProposalsGate} from "@box/pages/profile/equipment_proposals";
import {equipmentProposalApi} from "@box/entities/equipment_proposal";
import {EquipmentProposalList} from "@box/pages/profile/profile-equipment-proposal";


export const CompaniesFavouriteListForMakingMessages: React.FC<IWithClass> = ({className}) => {
    const proposals = useStore($proposals);
    const equipmentProposals = useStore($equipmentProposals);
    const companies = useStore($favoritesCompaniesList);
    const loading = useStore(favoriteCompaniesLoading.$loaderStore);
    const updateInFavorite = useUnit(updateCompanyInFavoriteFx);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);
    const router = useRouter();

    const [showProposalMenu, setShowProposalMenu] = useState<boolean>(false);
    const [showEquipmentProposalMenu, setShowEquipmentProposalMenu] = useState<boolean>(false);

    const [checking, setChecking] = useState(Array<number>);
    const [equipmentChecking, setEquipmentChecking] = useState(Array<number>);

    useGate(gate);
    useGate(proposalsGate);
    useGate(equipmentProposalsGate);

    const handleChangesFavorite = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        id: number
    ) => {
        e.stopPropagation();
        updateInFavorite({id});
    };

    const proposalsCheckedHandler = (selected: any) => {
        setChecking(selected);
    };

    const equipmentProposalsCheckedHandler = (selected: any) => {
        setEquipmentChecking(selected);
    }

    useEffect(() => {
    }, [proposals, companies]);

    const [sendEmail, setSendEmail] = useState<boolean>(false);
    const [sendTelegram, setSendTelegram] = useState<boolean>(false);
    const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(false);

    const [screenSize, satisfies] = useScreenSize();

    const isLaptop = screenSize === 'sm' || screenSize === 'xsm';
    const isMobile = screenSize === 'xxsm';

    const send_company_proposals_by_email = async (data: SendCompanyProposalsByEmail) => {
        await proposalApi.send_company_proposals_by_email(data)
            .then(() => setSendEmail(true));
    }

    const send_company_proposals_by_whatsapp = async (data: SendCompanyProposalsByEmail) => {
        await proposalApi.send_company_proposals_by_whatsapp(data)
            .then(() => setSendWhatsApp(true));
    }

    const send_company_proposals_by_telegram = async (data: SendCompanyProposalsByEmail) => {
        await proposalApi.send_company_proposals_by_telegram(data)
            .then(() => setSendTelegram(true));
    }

    const send_company_equipment_proposals_by_email = async (data: SendCompanyProposalsByEmail) => {
        await equipmentProposalApi.send_company_equipment_proposals_by_email(data)
            .then(() => setSendEmail(true));
    }

    const send_company_equipment_proposals_by_whatsapp = async (data: SendCompanyProposalsByEmail) => {
        await equipmentProposalApi.send_company_equipment_proposals_by_whatsapp(data)
            .then(() => setSendWhatsApp(true));
    }

    const send_company_equipment_proposals_by_telegram = async (data: SendCompanyProposalsByEmail) => {
        await equipmentProposalApi.send_company_equipment_proposals_by_telegram(data)
            .then(() => setSendTelegram(true));
    }

    if (loading) {
        return <Loader center className="mt-44"/>
    }
    return (
        <div className="w-auto">
            <Modal
                visible={sendEmail || sendTelegram || sendWhatsApp}
                close={() => {
                    setSendEmail(false);
                    setSendTelegram(false);
                    setSendTelegram(false);
                }}
                title={'Предложение отправлено'}>
                <p className="text-center text-grey-90">
                    {"Предложение разослано компаниям через Email"}
                </p>
                <div className="flex gap-[10px] mt-[20px]">
                    <Button
                        onClick={() => {
                            setSendEmail(false);
                            setSendTelegram(false);
                            setSendTelegram(false);
                        }}
                        className="grow">
                        Ок
                    </Button>
                </div>
            </Modal>
            {showProposalMenu && proposals.length > 0 ? <div>
                    <div className="mt-5">
                        <Button
                            fullWidth={true}
                            mode="light"
                            onClick={() => setShowProposalMenu(false)}
                        >
                            Скрыть сформированные предложения по сырью
                        </Button>
                    </div>
                    <div className={!isMobile ? 'p-5 inline-flex' : ''}>
                        <div className={!isMobile ? s.button_left : 'mt-4'}>
                            <Button
                                fullWidth={isMobile}
                                disabled={!checking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_proposals_by_whatsapp({proposals: checking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение через WhatsApp (${checking.length})`}
                            </Button>
                        </div>
                        <div className={!isMobile ? s.buttons_right : 'mt-4'}>
                            <Button
                                fullWidth={isMobile}
                                disabled={!checking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_proposals_by_telegram({proposals: checking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение через Telegram (${checking.length})`}
                            </Button>
                        </div>
                        <div className={!isMobile ? s.buttons_right : 'mt-4'}>
                            <Button
                                fullWidth={isMobile}
                                disabled={!checking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_proposals_by_email({proposals: checking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение по email (${checking.length})`}
                            </Button>
                        </div>

                    </div>
                    <ProposalList onChange={proposalsCheckedHandler}></ProposalList>
                </div> :
                <div className="mt-5">
                    <Button
                        disabled={!proposals[0]}
                        fullWidth={true}
                        mode="light"
                        onClick={() => setShowProposalMenu(true)}
                    >
                        {`Показать сформированные предложения по сырью (${proposals.length ? proposals.length : 'нет'})`}
                    </Button>
                </div>
            }
            <div className="mt-5">
                <Button
                    fullWidth={true}
                    mode="light"
                    onClick={() => router.push(`/profile/proposals/`)}
                >
                    Сформировать предложения по сырью для рассылки компаниям
                </Button>
            </div>
            {showEquipmentProposalMenu && equipmentProposals.length > 0 ? <div>
                    <div className="mt-5">
                        <Button
                            fullWidth={true}
                            mode="light"
                            onClick={() => setShowEquipmentProposalMenu(false)}
                        >
                            Скрыть сформированные предложения по оборудованию
                        </Button>
                    </div>
                    <div className={!isMobile ? 'p-5 inline-flex' : ''}>
                        <div className={!isMobile ? s.button_left : 'mt-4'}>
                            <Button
                                disabled={!equipmentChecking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_equipment_proposals_by_whatsapp({proposals: equipmentChecking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение по оборудованию через WhatsApp (${equipmentChecking.length})`}
                            </Button>
                        </div>
                        <div className={!isMobile ? s.buttons_right : 'mt-4'}>
                            <Button
                                disabled={!equipmentChecking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_equipment_proposals_by_telegram({proposals: equipmentChecking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение по оборудованию через Telegram (${equipmentChecking.length})`}
                            </Button>
                        </div>
                        <div className={!isMobile ? s.buttons_right : 'mt-4'}>
                            <Button
                                disabled={!equipmentChecking[0]}
                                type="mini"
                                mode="stroke"
                                onClick={() => {
                                    send_company_equipment_proposals_by_email({proposals: equipmentChecking})
                                }
                                }
                            >
                                {`Разослать выбранное предложение по оборудованию по email (${equipmentChecking.length})`}
                            </Button>
                        </div>
                    </div>
                    <EquipmentProposalList onChange={equipmentProposalsCheckedHandler}></EquipmentProposalList>
                </div> :
                <div className="mt-5">
                    <Button
                        disabled={!equipmentProposals[0]}
                        fullWidth={true}
                        mode="light"
                        onClick={() => setShowEquipmentProposalMenu(true)}
                    >
                        {`Показать сформированные предложения по оборудованию (${equipmentProposals.length ? equipmentProposals.length : 'нет'})`}
                    </Button>
                </div>
            }
            <div className="mt-5">
                <Button
                    fullWidth={true}
                    mode="light"
                    onClick={() => router.push(`/profile/equipment-proposals/`)}
                >
                    Сформировать предложения по оборудованию для рассылки компаниям
                </Button>
            </div>
            <div className={className}>
                <UsersFavoritesCompaniesListFilters/>
                {satisfies("md") ? (
                    <Table
                        separate
                        pagination={
                            <Pagination pagination={pagination}/>
                        }
                        loading={loading}
                        empty={companies.length === 0}
                        className={classNames(s.table_view, "mt-[14px]")}
                    >
                        <Table.Head
                            className={s.head}
                            headers={headers}
                            ordering={ord.ordering}
                            onOrderingChange={ord.setOrdering}
                        />
                        <Table.Body>
                            {companies.map((company) => (
                                <CompanyFavoritesRow
                                    key={company.id}
                                    company={company}
                                    favoriteButton={
                                        <div>
                                            <Button
                                                className={classNames("shrink-0", s.favorite)}
                                                onClick={(e) => handleChangesFavorite(e, company?.id)}
                                                mode="notFilled"
                                                iconLeft={<StarImg width={20}
                                                                   style={{fill: `${company?.isFavorite ? '' : 'none'}`}}/>}
                                            >
                                            </Button>
                                        </div>
                                    }
                                />
                            ))}
                        </Table.Body>
                    </Table>
                ) : (
                    <div className={s.card_view}>
                        <div className={classNames(s.card_view_block)}>
                            {companies.map((company) => (
                                <CompanyCard
                                    className={s.card_view_card}
                                    key={company.id}
                                    company={company}
                                    onClickInFavorite={(e) => handleChangesFavorite(e, company.id)}
                                />
                            ))}
                        </div>
                        <Pagination pagination={pagination}/>
                    </div>
                )}
            </div>
        </div>
    )
};