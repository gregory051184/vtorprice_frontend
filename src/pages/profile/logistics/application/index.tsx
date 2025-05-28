import React, {useEffect} from 'react';
import {AppShell, SidebarLayout} from '@box/layouts';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {
    BackButton, Container, Paper, Button, DisabledView
} from '@box/shared/ui';
import {AddDocuments, DealFlowForm, statusPops} from '@box/features/deal';
import {useEvent, useGate, useStore} from 'effector-react';
import {DealSteps} from '@box/entities/deal';
import {useRouter} from 'next/router';
import {ChatWidget} from '@box/widgets/chats';
import {Loader, Space} from '@mantine/core';
import {DealStatus, DealType, DocumentTypeForDeals, TransportApplicationStatus} from '@box/entities/deal/model';
import {File} from '@box/entities/company';
import {
    $deal, getDealFx, handleGoNext, gate, $offers, handleGoPrevious
} from './model';
import s from './style.module.scss';
import classNames from 'classnames';
import {TypedDoscViewerHolder} from '@box/features/deal/typed-docs-viewer/ui';

const documents = [
    {
        title: 'Доверенность на отгрузку',
        url: 'transport_applications',
        docType: 'unloading_agreement',
        typeNum: DocumentTypeForDeals.UNLOADING_AGREMEENT
    },
    {
        title: 'ТТН',
        url: 'transport_applications',
        docType: 'get_waybill',
        typeNum: DocumentTypeForDeals.WAYBILL
    },
    {
        title: 'Договор приложение спецификация',
        url: 'recyclables_deals',
        docType: 'get_specification_agreement',
        typeNum: DocumentTypeForDeals.AGREEMENT_SPECIFICATION,
        isRecyclable: true,
    },
    {
        title: 'Договор заявка',
        url: 'transport_applications',
        docType: 'get_application_agreement',
        typeNum: DocumentTypeForDeals.AGREEMENT_APPLICATION,
        logisticsStatusDisabled: [DealStatus.NEW, DealStatus.AGREEMENT],
        isLogistics: true
    },
    {
        title: 'УПД',
        url: 'transport_applications',
        docType: 'get_uniform_transfer_document',
        typeNum: DocumentTypeForDeals.UNIFORM_TRANSPORTATION_DOCUMENT
    },
    {
        title: 'Акт',
        url: 'recyclables_deals',
        docType: 'get_act_document',
        typeNum: DocumentTypeForDeals.ACT,
        isRecyclable: true,
        logisticsStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT,
                DealStatus.LOADED,
                DealStatus.UNLOADED
            ],
        isLogistics: true
    }
];

export const TransportApplication = () => {
    const deal = useStore($deal);
    const fetch = useEvent(getDealFx);
    const loading = useStore(getDealFx.pending);
    const router = useRouter();
    const goNext = useEvent(handleGoNext);

    const goPrevious = useEvent(handleGoPrevious);

    const offers = useStore($offers);
    const isTransport = true;
    const {contractor, logist} = deal?.transportApplication?.approvedLogisticsOffer || {};

    useGate(gate);

    useEffect(() => {
        // @ts-ignore
        fetch(router.query?.id?.toString());
    }, [router.query?.id]);


    useGate(gate);

    useEffect(() => {
        // @ts-ignore
        fetch(router.query?.id?.toString());
    }, [router.query?.id]);

    return (
        (
            <AppShell
                header={<Header/>}
                footer={<Footer/>}
            >
                <SidebarLayout>
                    <Container>
                        <BackButton/>
                        {loading ? <Loader color="green" mx="auto" my={20}/> : (
                            <>
                                <h1 className="text-2xl font-medium mt-[10px]">
                                    Заявка на транспорт №{deal?.transportApplication?.id}
                                </h1>
                                <div className={`flex gap-[20px] mt-[20px] ${s.description}`}>
                                    <div className="pl-[10px] border-l-2 border-l-primaryGreen-main">
                                        <p className="text-xs text-grey-40">
                                            Продавец
                                        </p>
                                        <p>
                                            {deal?.transportApplication?.sender}
                                        </p>
                                        <p className="font-medium text-primaryGreen-main text-lg">

                                            {deal?.supplierCompany?.phone || ""}
                                        </p>
                                    </div>
                                    <div
                                        className={classNames("pl-[10px] border-l-2", !!logist ? 'border-l-deep_blue-dark' : 'border-l-primaryGreen-main')}
                                    >
                                        <p className="text-xs text-grey-40">
                                            {!!logist ? "Логист" : "Покупатель"}
                                        </p>
                                        <p>
                                            {!!logist ? `${logist.first_name ? logist.first_name : logist.firstName} 
                                            ${logist.middle_name ? logist.middle_name : logist.middleName} 
                                            ${logist.last_name ? logist.last_name : logist.lastName}` : deal?.transportApplication?.recipient}
                                        </p>
                                        <p className={classNames("font-medium text-lg", !!logist ? "text-deep_blue-dark" : "text-primaryGreen-main")}>
                                            {!!logist ? logist?.phone || "" : deal?.buyerCompany?.phone || ""}
                                        </p>
                                    </div>
                                </div>

                                {deal && deal?.transportApplication && deal.status.id === DealStatus.REJECTED && (
                                    <DisabledView disabled>
                                        <div className={`flex gap-[50px] mt-[20px] ${s.container}`}>
                                            <div className="flex flex-col gap-[20px] min-w-[350px]">
                                                {statusPops[deal.transportApplication.status.id] && deal.transportApplication.status.id > 1
                                                    && (
                                                        <Paper>
                                                            {React.createElement(statusPops[deal.transportApplication.status.id] || null, {})}
                                                        </Paper>
                                                    )}
                                                <Paper>
                                                    <DealFlowForm
                                                        deliveryPrice={deal?.transportApplication?.approvedLogisticsOffer?.amount}
                                                        contractor={contractor?.name}
                                                    />
                                                </Paper>
                                            </div>
                                            <div className={`max-w-[350px] min-w-[232px] w-full shrink-1 ${s.right}`}>
                                                <DealSteps
                                                    type={!isTransport ? DealType.RECYCLABLES : DealType.TRANSPORT}
                                                    step={deal.transportApplication.status.id}
                                                />
                                                <Button onClick={goNext} type="mini" className="mt-[20px]" fullWidth>
                                                    Далее
                                                </Button>
                                                <Space h={10}/>
                                                {deal?.chat ? <ChatWidget mini chatId={deal?.chat}/> : null}
                                            </div>
                                        </div>
                                    </DisabledView>
                                )}

                                {deal && deal?.transportApplication && deal.status.id !== DealStatus.REJECTED && (
                                    <div className={`flex gap-[50px] mt-[20px] ${s.container}`}>
                                        <div className="flex flex-col gap-[20px] min-w-[350px]">
                                            {statusPops[deal.transportApplication.status.id] && deal.transportApplication.status.id > 1
                                                && (
                                                    <Paper>
                                                        {React.createElement(statusPops[deal.transportApplication.status.id] || null, {})}
                                                    </Paper>
                                                )}
                                            {deal.transportApplication.status.id === TransportApplicationStatus.AGREEMENT
                                                && (
                                                    <Paper mode="light" className={s.left_logist_offers}>
                                                        <h3 className="text-base ">Предложения от логистов</h3>
                                                        <div
                                                            className="mt-[20px] max-h-[300px] overflow-y-auto flex flex-col gap-[12px]">
                                                            {offers.map((offer) => (
                                                                <div
                                                                    className="flex items-center justify-between pb-[12px] border-b border-b-grey-20">
                                                                    <div>
                                                                        <h5 className="text-base">{offer.contractor.name}</h5>
                                                                        <p className="text-xs text-grey-70 mt-[4px]">
                                                                            Предложение:
                                                                            {' '}
                                                                            {offer.amount}
                                                                            {' '}
                                                                            ₽
                                                                        </p>
                                                                        <p className="text-xs text-grey-50 mt-[4px]">{new Intl.DateTimeFormat('ru-RU').format(new Date(offer.createdAt))}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-[15px]">
                                                                        {offer.chat.unreadCount > 0 && (
                                                                            <div
                                                                                className="px-[8px] py-[2px] bg-red-dark flex items-center justify-center rounded-[100px]">
                                                                                <p className="text-white text-xs">{offer.chat.unreadCount}</p>
                                                                            </div>
                                                                        )}
                                                                        <Button
                                                                            onClick={() => router.push(`/profile/transport-applications/${offer.application.id}?offer=${offer.id}`)}
                                                                            type="mini" mode="stroke">Обсудить</Button>
                                                                    </div>
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </Paper>
                                                )}
                                            <Paper>
                                                <DealFlowForm
                                                    deliveryPrice={deal?.transportApplication?.approvedLogisticsOffer?.amount}
                                                    contractor={contractor?.name}
                                                />
                                            </Paper>
                                            {deal && deal.transportApplication?.status.id && Object.entries(statusPops).map(([key, val]) => {
                                                // @ts-ignore
                                                if (parseInt(key, 10) < deal.transportApplication.status.id) {
                                                    return (
                                                        <Paper>
                                                            <DisabledView disabled>
                                                                {React.createElement(val, {
                                                                    key
                                                                })}
                                                            </DisabledView>
                                                        </Paper>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                        <div className={`max-w-[350px] min-w-[232px] w-full shrink-1 ${s.right}`}>
                                            {deal.transportApplication.status.id === TransportApplicationStatus.AGREEMENT
                                                && (
                                                    <Paper mode="light" className={s.right_logist_offers}>
                                                        <h3 className="text-base ">Предложения от логистов</h3>
                                                        <div
                                                            className="mt-[20px] max-h-[300px] overflow-y-auto flex flex-col gap-[12px]">
                                                            {offers.map((offer) => (
                                                                <div
                                                                    className="flex items-center justify-between pb-[12px] border-b border-b-grey-20">
                                                                    <div>
                                                                        <h5 className="text-base">{offer.contractor.name}</h5>
                                                                        <p className="text-xs text-grey-70 mt-[4px]">
                                                                            Предложение:
                                                                            {' '}
                                                                            {offer.amount}
                                                                            {' '}
                                                                            ₽
                                                                        </p>
                                                                        <p className="text-xs text-grey-50 mt-[4px]">{new Intl.DateTimeFormat('ru-RU').format(new Date(offer.createdAt))}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-[15px]">
                                                                        {offer.chat.unreadCount > 0 && (
                                                                            <div
                                                                                className="px-[8px] py-[2px] bg-red-dark flex items-center justify-center rounded-[100px]">
                                                                                <p className="text-white text-xs">{offer.chat.unreadCount}</p>
                                                                            </div>
                                                                        )}
                                                                        <Button
                                                                            onClick={() => router.push(`/profile/transport-applications/${offer.application.id}?offer=${offer.id}`)}
                                                                            type="mini" mode="stroke">Обсудить</Button>
                                                                    </div>
                                                                </div>

                                                            ))}
                                                        </div>
                                                    </Paper>
                                                )}
                                            <DealSteps
                                                type={!isTransport ? DealType.RECYCLABLES : DealType.TRANSPORT}
                                                step={deal.transportApplication.status.id}
                                            />
                                            <Button
                                                onClick={goNext}
                                                type="mini"
                                                className="mt-[20px]"
                                                fullWidth
                                                disabled={deal.transportApplication?.status.id === TransportApplicationStatus.FINAL}
                                            >
                                                Далее
                                            </Button>
                                            <Space h={10}/>
                                            <Button
                                                onClick={goPrevious}
                                                type="mini" className="mt-[20px]"
                                                fullWidth
                                                disabled={deal.transportApplication?.status.id === TransportApplicationStatus.COMPLETED || deal.transportApplication?.status.id === TransportApplicationStatus.FINAL}
                                            >
                                                Назад
                                            </Button>
                                            <Space h={10}/>

                                            <TypedDoscViewerHolder deal={deal} documents={documents} dealType='Deals'/>

                                            <Space h={10}/>
                                            {deal?.chat ? <ChatWidget mini
                                                                      name={isTransport ? `Чат с логистом` : `Сделка №${deal.dealNumber}`}
                                                                      chatId={deal?.chat}/> : null}
                                            <Space h={20}/>
                                            <AddDocuments/>
                                            <div className="flex flex-col gap-[10px] mt-[10px]">
                                                {deal.documents.filter((docItem) => !docItem.documentType?.id).map((doc) => (
                                                    <File
                                                        onSelect={() => null}
                                                        // @ts-ignore
                                                        file={{file: doc.document}}
                                                        name={doc.name}
                                                    />
                                                ))}
                                            </div>
                                            <Space h={20}/>
                                        </div>
                                    </div>
                                )}

                            </>
                        )}

                    </Container>
                </SidebarLayout>
            </AppShell>
        )
    );
};

