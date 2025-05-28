import React, {useEffect} from 'react';
import {AppShell, SidebarLayout} from '@box/layouts';
import {Header} from '@box/widgets/header';
import {Footer} from '@box/widgets/footer';
import {
    BackButton, Container, Paper, Button, DisabledView
} from '@box/shared/ui';
import {AddDocuments, DealFlowForm} from '@box/features/deal';
import {useEvent, useGate, useStore} from 'effector-react';
import {dealApi, DealSteps} from '@box/entities/deal';
import {useRouter} from 'next/router';
import {ChatWidget} from '@box/widgets/chats';
import {Loader, Space} from '@mantine/core';
import {DealStatus, DealType, DocumentTypeForDeals, IDealDocument} from '@box/entities/deal/model';
import {File} from '@box/entities/company';
import {
    $deal, getDealFx, handleGoNext, gate, deleteDocumentFx, handleGoPrevious
} from './model';
import {WhoDelivers} from "@box/features/deal/forms/flow/ui/whoDelivers";
import {CargoLoaded} from "@box/features/deal/forms/flow/ui/cardoLoaded";
import {CargoUnloaded} from "@box/features/deal/forms/flow/ui/cargoUnloaded";
import {$authStore} from "@box/entities/auth";
import RemoveIcon from '@assets/icons/24_clear.svg';
import s from './style.module.scss';
import classNames from "classnames";
import {TypedDoscViewerHolder} from '@box/features/deal/typed-docs-viewer/ui';


const documents = [
    {
        title: 'Доверенность на отгрузку',
        url: 'transport_applications',
        docType: 'unloading_agreement',
        typeNum: DocumentTypeForDeals.UNLOADING_AGREMEENT,
        dealStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT
            ]
    },
    {
        title: 'ТТН',
        url: 'transport_applications',
        docType: 'get_waybill',
        typeNum: DocumentTypeForDeals.WAYBILL,
        dealStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT,
                DealStatus.LOADED
            ],
    },
    {
        title: 'Договор приложение спецификация',
        url: 'recyclables_deals',
        docType: 'get_specification_agreement',
        typeNum: DocumentTypeForDeals.AGREEMENT_SPECIFICATION,
        dealStatusDisabled: [],
        isRecyclable: true,
    },
    {
        title: 'Договор заявка',
        url: 'transport_applications',
        docType: 'get_application_agreement',
        typeNum: DocumentTypeForDeals.AGREEMENT_APPLICATION,
        logisticsStatusDisabled: [DealStatus.NEW, DealStatus.AGREEMENT],
        dealStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT
            ],
        isLogistics: true
    },
    {
        title: 'УПД',
        url: 'transport_applications',
        docType: 'get_uniform_transfer_document',
        typeNum: DocumentTypeForDeals.UNIFORM_TRANSPORTATION_DOCUMENT,
        dealStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT,
                DealStatus.LOADED
            ],
    },
    {
        title: 'Акт',
        url: 'recyclables_deals',
        docType: 'get_act_document',
        typeNum: DocumentTypeForDeals.ACT,
        logisticsStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT,
                DealStatus.LOADED,
                DealStatus.UNLOADED
            ],
        dealStatusDisabled:
            [
                DealStatus.NEW,
                DealStatus.AGREEMENT,
                DealStatus.LOGIST_ASSIGNMENT,
                DealStatus.LOADED,
                DealStatus.UNLOADED
            ],
        isRecyclable: true,
        isLogistics: true
    }
];

export const statusPops: Record<number, React.FC> = {
    [DealStatus.AGREEMENT]: WhoDelivers,
    [DealStatus.LOADED]: CargoLoaded,
    [DealStatus.UNLOADED]: CargoUnloaded,
    [DealStatus.FINAL]: CargoUnloaded,
};

export const Deal = () => {
    const deal = useStore($deal);
    const fetch = useEvent(getDealFx);
    const deleteDocument = useEvent(deleteDocumentFx);
    const loading = useStore(getDealFx.pending);
    const router = useRouter();
    const goNext = useEvent(handleGoNext);
    //ДОБАВИЛ
    const goPrevious = useEvent(handleGoPrevious);

    const isTransport = false
    const {user} = useStore($authStore);
    useGate(gate);
    const userCompanyId = user?.company?.id;
    const isSupplier = userCompanyId === deal?.supplierCompany.id;
    const isBuyer = userCompanyId === deal?.buyerCompany.id;

    useEffect(() => {
        // @ts-ignore
        fetch(router.query?.id?.toString());
    }, [router.query?.id]);

    const getDoc = async (url: string, id: number, docType: string) => {
        try {
            const {data} = await dealApi.getDoc(url, id, docType)

            if (!!data.document) {
                window.open(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`, '_blank');
            }
        } catch (e) {
            console.log(e);
        }
    }

    const buyerDocuments: IDealDocument[] = [];
    const supplierDocuments: IDealDocument[] = [];
    const otherDocuments: IDealDocument[] = [];

    !!deal?.documents?.length && deal?.documents
        .filter((docItem) => !docItem.documentType?.id)
        .forEach(doc =>
            doc.company === deal.buyerCompany.id ?
                buyerDocuments.push(doc) :
                doc.company === deal.supplierCompany.id ? supplierDocuments.push(doc) : otherDocuments.push(doc)
        )

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
                                    Сделка с
                                    {' '}
                                    {deal?.buyerCompany.name}
                                </h1>
                                <div className={classNames("flex gap-[20px] mt-[20px]", s.description)}>
                                    <div className="pl-[10px] border-l-2 border-l-primaryGreen-main">
                                        <p className="text-xs text-grey-40">
                                            Продавец
                                        </p>
                                        <p>
                                            {deal?.supplierCompany.name}
                                        </p>
                                        <p className="font-medium text-primaryGreen-main text-lg">

                                            {deal?.supplierCompany.phone}
                                        </p>
                                    </div>
                                    <div className="pl-[10px] border-l-2 border-l-primaryGreen-main">
                                        <p className="text-xs text-grey-40">
                                            Покупатель
                                        </p>
                                        <p>
                                            {deal?.buyerCompany.name}
                                        </p>
                                        <p className="font-medium text-primaryGreen-main text-lg">
                                            {deal?.buyerCompany.phone}
                                        </p>
                                    </div>
                                </div>

                                {deal && deal.status.id === DealStatus.REJECTED && (
                                    <DisabledView disabled>
                                        <div className={classNames("flex gap-[32px] mt-[20px]", s.container)}>
                                            <div className="flex flex-col gap-[20px] min-w-[350px]">
                                                {statusPops[deal.status.id]
                                                    && (
                                                        <Paper className={s.paper}>
                                                            {React.createElement(statusPops[deal.status.id] || null, {})}
                                                        </Paper>
                                                    )}
                                                <Paper className={s.paper}>
                                                    <DealFlowForm
                                                        totalPrice={deal.totalPrice}
                                                        whoDelivers={deal.whoDelivers.id}
                                                        isSupplier={isSupplier}
                                                        isBuyer={isBuyer}
                                                        buyerpaysshipping={deal.buyerPaysShipping}
                                                    />
                                                </Paper>
                                            </div>
                                            <div
                                                className={classNames("max-w-[350px] min-w-[232px] w-full shrink-1", s.right)}>
                                                <DealSteps
                                                    type={!isTransport ? DealType.RECYCLABLES : DealType.TRANSPORT}
                                                    step={deal.status.id}
                                                />
                                                <Button onClick={goNext} type="mini" className="mt-[20px]" fullWidth>
                                                    Далее
                                                </Button>
                                                {/*ДОБАВИЛ!!!!!!!!!!!!!!!!!!!!!!!!*/}
                                                <Space h={10}/>
                                                <Button onClick={goPrevious} type="mini" className="mt-[20px]"
                                                        fullWidth>
                                                    Назад
                                                </Button>
                                                <Space h={10}/>
                                                {deal?.chat ? <ChatWidget mini chatId={deal?.chat}/> : null}
                                            </div>
                                        </div>
                                    </DisabledView>
                                )}

                                {deal && deal.status.id !== DealStatus.REJECTED && (
                                    <div className={classNames("flex gap-[32px] mt-[20px]", s.container)}>
                                        <div className="flex flex-col gap-[20px] min-w-[350px]">
                                            {statusPops[deal.status.id]
                                                && (
                                                    <Paper className={s.paper}>
                                                        {React.createElement(statusPops[deal.status.id] || null, {})}
                                                    </Paper>
                                                )}
                                            <Paper className={s.paper}>
                                                <DealFlowForm
                                                    disabled={deal.status.id === DealStatus.LOGIST_ASSIGNMENT}
                                                    whoDelivers={deal.whoDelivers.id}
                                                    isSupplier={isSupplier}
                                                    isBuyer={isBuyer}
                                                    totalPrice={deal.totalPrice}
                                                    buyerpaysshipping={deal.buyerPaysShipping}
                                                />
                                            </Paper>
                                            {deal && Object.entries(statusPops).map(([key, val]) => {
                                                if (parseInt(key, 10) < deal.status.id) {
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
                                        <div
                                            className={classNames("max-w-[350px] min-w-[232px] w-full shrink-1", s.right)}>
                                            <DealSteps
                                                type={!isTransport ? DealType.RECYCLABLES : DealType.TRANSPORT}
                                                step={deal.status.id}
                                            />
                                            <Button
                                                onClick={goNext}
                                                type="mini"
                                                className="mt-[20px]"
                                                fullWidth
                                                disabled={deal.status.id === DealStatus.LOGIST_ASSIGNMENT || deal.status.id === DealStatus.CLOSED}
                                            >
                                                {deal.status.id === 5 ? 'Закрыть сделку' : 'Далее'}
                                            </Button>

                                            {/*ДОБАВИЛ!!!!!!!!!!!!!!!!!!!!!!!!*/}
                                            <Space h={10}/>

                                            <Button
                                                onClick={goPrevious}
                                                type="mini" className="mt-[20px]"
                                                fullWidth
                                                disabled={deal.status.id === DealStatus.CLOSED}
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
                                            <div className="flex flex-col gap-[16px] mt-[24px]">
                                                {
                                                    !!buyerDocuments.length &&
                                                    <div className='flex flex-col gap-[16px]'>
                                                        <span
                                                            className='text-[12px] text-grey-30'>Загружено покупателем</span>
                                                        <div className='flex flex-col gap-[16px]'>
                                                            {
                                                                buyerDocuments.map(doc =>
                                                                    <div
                                                                        className={classNames("flex justify-between items-center bg-grey-10 pr-[16px] rounded-[10px]", s.file)}
                                                                    >
                                                                        <File
                                                                            onSelect={() => null}
                                                                            // @ts-ignore
                                                                            file={{file: doc.document}}
                                                                            name={doc.name}
                                                                        />
                                                                        <div className='min-w-[24px] ml-[8px]'>
                                                                            <RemoveIcon
                                                                                className="ml-[10px] cursor-pointer"
                                                                                onClick={() => deleteDocument({
                                                                                    dealId: deal?.id,
                                                                                    docId: doc.id
                                                                                })}/>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    !!supplierDocuments.length &&
                                                    <div className='flex flex-col gap-[16px]'>
                                                        <span
                                                            className='text-[12px] text-grey-30'>Загружено продавцом</span>
                                                        <div className='flex flex-col gap-[16px]'>
                                                            {
                                                                supplierDocuments.map(doc =>
                                                                    <div
                                                                        className={classNames("flex justify-between items-center bg-grey-10 pr-[16px] rounded-[10px]", s.file)}
                                                                    >
                                                                        <File
                                                                            onSelect={() => null}
                                                                            // @ts-ignore
                                                                            file={{file: doc.document}}
                                                                            name={doc.name}
                                                                        />
                                                                        <div className='min-w-[24px] ml-[8px]'>
                                                                            <RemoveIcon
                                                                                className="ml-[10px] cursor-pointer"
                                                                                onClick={() => deleteDocument({
                                                                                    dealId: deal?.id,
                                                                                    docId: doc.id
                                                                                })}/>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    !!otherDocuments.length &&
                                                    <div className='flex flex-col gap-[16px]'>
                                                        {
                                                            otherDocuments.map(doc =>
                                                                <div
                                                                    className={classNames("flex justify-between items-center bg-grey-10 pr-[16px] rounded-[10px]", s.file)}
                                                                >
                                                                    <File
                                                                        onSelect={() => null}
                                                                        // @ts-ignore
                                                                        file={{file: doc.document}}
                                                                        name={doc.name}
                                                                    />
                                                                    <div className='min-w-[24px] ml-[8px]'>
                                                                        <RemoveIcon className="ml-[10px] cursor-pointer"
                                                                                    onClick={() => deleteDocument({
                                                                                        dealId: deal?.id,
                                                                                        docId: doc.id
                                                                                    })}/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                }
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
