import React, {useEffect} from "react";
import {useEvent, useGate, useStore} from "effector-react";
import {
    getEquipmentDealFx,
    $equipmentDeal,
    gate,
    handleGoNext,
    handleGoPrevious,
    deleteEquipmentDocumentFx
} from './model';
import {useRouter} from "next/router";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {AppShell, SidebarLayout} from '@box/layouts';
import {
    BackButton, Container, Paper, Button, DisabledView
} from '@box/shared/ui';
import {Loader, Space} from "@mantine/core";
import classNames from "classnames";
import {DealStatus, DealType, DocumentTypeForDeals, IDealDocument} from "@box/entities/deal/model";
import {AddDocuments, EquipmentDealFlowForm} from "@box/features/deal";
import {dealApi, DealSteps} from "@box/entities/deal";
import {ChatWidget} from "@box/widgets/chats";
import {$authStore} from "@box/entities/auth";
import s from '../../deals/deal/style.module.scss';
import {File} from "@box/entities/company";
import RemoveIcon from "@assets/icons/24_clear.svg";
import {EquipmentWhoDelivers} from "@box/features/deal/forms/equipment/flow/ui/equipmentWhoDelivers";
import {EquipmentCargoLoaded} from "@box/features/deal/forms/equipment/flow/ui/equipmentCargoLoaded";
import {EquipmentCargoUnloaded} from "@box/features/deal/forms/equipment/flow/ui/equipmentCargoUnloaded";
import {TypedDoscViewerHolder} from "@box/features/deal/typed-docs-viewer/ui";


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
        isEquipment: true
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
        isEquipment: true,
        isLogistics: true
    }
];

const statusPops: Record<number, React.FC> = {
    [DealStatus.AGREEMENT]: EquipmentWhoDelivers,
    [DealStatus.LOADED]: EquipmentCargoLoaded,
    [DealStatus.UNLOADED]: EquipmentCargoUnloaded,
    [DealStatus.FINAL]: EquipmentCargoUnloaded,
};

const EquipmentDeal = () => {
    const fetch = useEvent(getEquipmentDealFx);
    const {query} = useRouter();
    const deal = useStore($equipmentDeal);
    const loading = useStore(getEquipmentDealFx.pending);
    const isTransport = false;
    const {user} = useStore($authStore);
    const userCompanyId = user?.company?.id;
    const isSupplier = userCompanyId === deal?.supplierCompany.id;
    const isBuyer = userCompanyId === deal?.buyerCompany.id;
    useGate(gate);
    const goNext = useEvent(handleGoNext);

    const goPrevious = useEvent(handleGoPrevious);

    const deleteDocument = useEvent(deleteEquipmentDocumentFx);

    useEffect(() => {
        // @ts-ignore
        fetch(query?.id?.toString());
    }, [query?.id]);

    const getDoc = async (url: string, id: number, docType: string) => {
        try {
            const {data} = await dealApi.getDoc(url, id, docType)

            if (!!data.document) {
                window.open(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`, '_blank');
            }
        } catch {
        }
    }

    const buyerDocuments: IDealDocument[] = [];
    const supplierDocuments: IDealDocument[] = [];
    const otherDocuments: IDealDocument[] = [];

    // @ts-ignore
    !!deal?.documents?.length && deal?.documents.filter((docItem) => !docItem.documentType?.id).forEach(doc =>
        doc.company === deal.buyerCompany.id ?
            buyerDocuments.push(doc) :
            doc.company === deal.supplierCompany.id ? supplierDocuments.push(doc) : otherDocuments.push(doc)
    )

    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <SidebarLayout>
                <Container>
                    <BackButton/>
                    {
                        loading ?
                            <Loader color="green" mx="auto" my={20}/> :
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
                                        <div className={classNames("flex gap-[20px] mt-[20px]", s.container)}>
                                            <div className="flex flex-col gap-[20px] min-w-[350px]">
                                                {statusPops[deal.status.id]
                                                    && (
                                                        <Paper>
                                                            {React.createElement(statusPops[deal.status.id] || null, {})}
                                                        </Paper>
                                                    )}
                                                <Paper>
                                                    <EquipmentDealFlowForm
                                                        whoDelivers={deal.whoDelivers.id}
                                                        isSupplier={isSupplier}
                                                        isBuyer={isBuyer}
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
                                                <Space h={10}/>
                                                <Button onClick={goPrevious} type="mini" className="mt-[20px]" fullWidth>
                                                    Далее
                                                </Button>
                                                <Space h={10}/>
                                                {deal?.chat ? <ChatWidget mini chatId={deal?.chat}/> : null}
                                            </div>
                                        </div>
                                    </DisabledView>
                                )}

                                {deal && deal.status.id !== DealStatus.REJECTED && (
                                    <div className={classNames("flex gap-[20px] mt-[20px]", s.container)}>
                                        <div className="flex flex-col gap-[20px] min-w-[380px]">
                                            {statusPops[deal.status.id] && (
                                                <Paper>
                                                    {React.createElement(statusPops[deal.status.id] || null, {})}
                                                </Paper>
                                            )}
                                            <Paper>
                                                <EquipmentDealFlowForm
                                                    disabled={deal.status.id === DealStatus.LOGIST_ASSIGNMENT}
                                                    whoDelivers={deal.whoDelivers.id}
                                                    isSupplier={isSupplier}
                                                    isBuyer={isBuyer}
                                                />
                                            </Paper>
                                            {deal && Object.entries(statusPops).map(([key, val]) => {
                                                if (parseInt(key, 10) < deal.status.id) {
                                                    return (
                                                        <Paper key={key}>
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
                                                Далее
                                            </Button>
                                            <Space h={10}/>
                                            <Button
                                                onClick={goPrevious}
                                                type="mini"
                                                className="mt-[20px]"
                                                fullWidth
                                                disabled={deal.status.id === DealStatus.LOGIST_ASSIGNMENT || deal.status.id === DealStatus.CLOSED}
                                            >
                                                Назад
                                            </Button>
                                            <Space h={10}/>


                                            {/*<div className="max-h-[300px] overflow-auto">
                        {documents.map((doc) => (
                          <DisabledView disabled={deal.status.id === DealStatus.AGREEMENT || (!deal?.transportApplication && !doc.isEquipment && deal.status.id !== 6)} key={doc.title}>
                            <div className="p-[26px] bg-grey-10 rounded-[20px] mt-[15px]">
                              {/* @ts-ignore 
                              <div onClick={() => getDoc(doc.url, doc.isEquipment ? deal?.id : deal?.transportApplication?.id, doc.docType)}
                                   className="text-sm underline decoration-dotted cursor-pointer"
                              >
                                {doc.title}
                              </div>
                            </div>
                          </DisabledView>
                        ))}
                      </div>*/}

                                            <TypedDoscViewerHolder deal={deal} documents={documents}
                                                                   dealType="EquipmentDeals"/>

                                            <Space h={10}/>
                                            {deal?.chat ? <ChatWidget mini
                                                                      name={isTransport ? `Чат с логистом` : `Сделка №${deal.dealNumber}`}
                                                                      chatId={deal?.chat}/> : null}
                                            <Space h={20}/>
                                            <AddDocuments isEquipment/>
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
                    }
                </Container>
            </SidebarLayout>
        </AppShell>
    )
}

export {EquipmentDeal}
