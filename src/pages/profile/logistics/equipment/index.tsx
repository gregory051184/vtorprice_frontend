import React, { FC, useEffect } from "react";
import { dealApi, DealSteps } from "@box/entities/deal";
import { AppShell, SidebarLayout } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { BackButton, Button, DisabledView, Paper } from "@box/shared/ui";
import { useEvent, useGate, useStore } from "effector-react";
import { $deal, getDealFx, gate, handleGoNext, $offers, deleteEquipmentDocumentFx } from "./model";
import { useRouter } from "next/router";
import { Loader, Space } from "@mantine/core";
import s from "./style.module.scss";
import classNames from "classnames";
import { AddDocuments, EquipmentDealFlowForm } from '@box/features/deal';
import { DealStatus, DealType, DocumentTypeForDeals, TransportApplicationStatus } from "@box/entities/deal/model";
import { ChatWidget } from "@box/widgets/chats";
import { File } from "@box/entities/company";
import RemoveIcon from "@assets/icons/24_clear.svg";
import { EquipmentWhoDelivers } from "@box/features/deal/forms/equipment/flow/ui/equipmentWhoDelivers";
import { EquipmentCargoLoaded } from "@box/features/deal/forms/equipment/flow/ui/equipmentCargoLoaded";
import { EquipmentCargoUnloaded } from "@box/features/deal/forms/equipment/flow/ui/equipmentCargoUnloaded";
import { TypedDoscViewerHolder } from "@box/features/deal/typed-docs-viewer/ui";

const documents = [
  {
    title: 'Доверенность на отгрузку',
    url: 'transport_applications',
    docType: 'unloading_agreement',
    typeNum: DocumentTypeForDeals.UNLOADING_AGREMEENT
  },
  {
    title: 'ТТН',
    utl: 'transport_applications',
    docType: 'get_waybill',
    typeNum: DocumentTypeForDeals.WAYBILL
  },
  {
    title: 'Договор приложение спецификация',
    url: 'equipment_deals',
    docType: 'get_specification_agreement',
    typeNum: DocumentTypeForDeals.AGREEMENT_SPECIFICATION,
    isEquipment: true
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
    url: 'equipment_deals',
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
    isLogistics: true,
    isEquipment: true
  }
];

const statusPops: Record<number, React.FC> = {
  [TransportApplicationStatus.AGREEMENT]: EquipmentWhoDelivers,
  [TransportApplicationStatus.LOADING]: EquipmentCargoLoaded,
  [TransportApplicationStatus.UNLOADING]: EquipmentCargoUnloaded,
  [TransportApplicationStatus.COMPLETED]: EquipmentCargoUnloaded,
};

const EquipmentApplication: FC = () => {
  const deal = useStore($deal);
  const fetch = useEvent(getDealFx);
  const loading = useStore(getDealFx.pending);
  const router = useRouter();
  const goNext = useEvent(handleGoNext);
  const offers = useStore($offers);
  const deleteDocument = useEvent(deleteEquipmentDocumentFx);
  const  { contractor, logist} = deal?.transportApplication?.approvedLogisticsOffer || {};

  useGate(gate);

  useEffect(() => {
    // @ts-ignore
    fetch(router.query?.id?.toString());
  }, [router.query?.id]);

  const getDoc = async (url: string, id: number, docType: string) => {
    try {
      const { data} = await dealApi.getDoc(url, id, docType)

      if (!!data.document) {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}${data.document}`, '_blank');
      }
    } catch {}
  }


  return (
    <AppShell
      header={<Header />}
      footer={<Footer />}
    >
      <SidebarLayout>
        <BackButton />
        {
          loading ?
            <Loader color="green" mx="auto" my={20} /> : (
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

                    {deal?.supplierCompany.phone}
                  </p>
                </div>
                <div
                  className={classNames("pl-[10px] border-l-2", !!logist ? 'border-l-deep_blue-dark' : 'border-l-primaryGreen-main')}
                >
                  <p className="text-xs text-grey-40">
                    {!!logist ? "Логист" : "Покупатель" }
                  </p>
                  <p>
                    {!!logist ? `${logist.firstName} ${logist.middleName} ${logist.lastName}` : deal?.transportApplication?.recipient}
                  </p>
                  <p className={classNames("font-medium text-lg", !!logist ? "text-deep_blue-dark" : "text-primaryGreen-main")}>
                    {!!logist ? logist.phone : deal?.buyerCompany.phone}
                  </p>
                </div>
              </div>

                {
                  deal && deal?.transportApplication && deal.status.id === DealStatus.REJECTED && (
                    <DisabledView disabled>
                      <div className={`flex gap-[20px] mt-[20px] ${s.container}`}>
                        <div className="flex flex-col gap-[20px] min-w-[380px]">
                          {statusPops[deal.transportApplication.status.id] && deal.transportApplication.status.id > 1
                            && (
                              <Paper>
                                {React.createElement(statusPops[deal.transportApplication.status.id] || null, {})}
                              </Paper>
                            )
                          }
                          <Paper>
                            <EquipmentDealFlowForm
                              deliveryPrice={deal?.transportApplication?.approvedLogisticsOffer?.amount}
                              contractor={contractor?.name}
                            />
                          </Paper>
                        </div>
                        <div className={`max-w-[350px] min-w-[232px] w-full shrink-1 ${s.right}`}>
                          <DealSteps
                            type={DealType.TRANSPORT}
                            step={deal.transportApplication.status.id}
                          />
                          <Button onClick={goNext} type="mini" className="mt-[20px]" fullWidth>
                            Далее
                          </Button>
                          <Space h={10} />
                          {deal?.chat ? <ChatWidget mini chatId={deal?.chat} /> : null}
                        </div>
                      </div>
                    </DisabledView>
                  )
                }

                {
                  deal && deal?.transportApplication && deal.status.id !== DealStatus.REJECTED && (
                    <div className={`flex gap-[20px] mt-[20px] ${s.container}`}>
                      <div className="flex flex-col gap-[20px] min-w-[380px]">
                        {statusPops[deal.transportApplication.status.id] && deal.transportApplication.status.id > 1
                          && (
                            <Paper>
                              {React.createElement(statusPops[deal.transportApplication.status.id] || null, {})}
                            </Paper>
                          )
                        }
                        {
                          deal.transportApplication.status.id === TransportApplicationStatus.AGREEMENT && (
                            <Paper mode="light" className={s.left_logist_offers}>
                              <h3 className="text-base ">Предложения от логистов</h3>
                              <div className="mt-[20px] max-h-[300px] overflow-y-auto flex flex-col gap-[12px]">
                                {offers.map((offer) => (
                                  <div className="flex items-center justify-between pb-[12px] border-b border-b-grey-20" key={offer.id}>
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
                                        <div className="px-[8px] py-[2px] bg-red-dark flex items-center justify-center rounded-[100px]">
                                          <p className="text-white text-xs">{offer.chat.unreadCount}</p>
                                        </div>
                                      )}
                                      <Button onClick={() => router.push(`/profile/transport-applications/${offer.application.id}?offer=${offer.id}`)} type="mini" mode="stroke">Обсудить</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Paper>
                          )
                        }
                        <Paper>
                          <EquipmentDealFlowForm
                            deliveryPrice={deal?.transportApplication?.approvedLogisticsOffer?.amount}
                            contractor={contractor?.name}
                          />
                        </Paper>
                        {deal && deal.transportApplication?.status.id &&  Object.entries(statusPops).map(([key, val]) => {
                          // @ts-ignore
                          if (parseInt(key, 10) < deal.transportApplication.status.id) {
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
                      <div className={`max-w-[350px] min-w-[232px] w-full shrink-1 ${s.right}`}>
                        {
                          deal.transportApplication.status.id === TransportApplicationStatus.AGREEMENT && (
                            <Paper mode="light" className={s.right_logist_offers}>
                              <h3 className="text-base ">Предложения от логистов</h3>
                              <div className="mt-[20px] max-h-[300px] overflow-y-auto flex flex-col gap-[12px]">
                                {offers.map((offer) => (
                                  <div className="flex items-center justify-between pb-[12px] border-b border-b-grey-20" key={offer.id}>
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
                                        <div className="px-[8px] py-[2px] bg-red-dark flex items-center justify-center rounded-[100px]">
                                          <p className="text-white text-xs">{offer.chat.unreadCount}</p>
                                        </div>
                                      )}
                                      <Button onClick={() => router.push(`/profile/transport-applications/${offer.application.id}?offer=${offer.id}`)} type="mini" mode="stroke">Обсудить</Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Paper>
                          )
                        }
                        <DealSteps
                          type={DealType.TRANSPORT}
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
                        <Space h={10} />

                        <TypedDoscViewerHolder deal={deal} documents={documents} dealType="EquipmentDeals"/>

                        <Space h={10} />
                        {deal?.chat ? <ChatWidget mini name='Чат с логистом' chatId={deal?.chat} /> : null}
                        <Space h={20} />
                        <AddDocuments isEquipment />
                        <div className="flex flex-col gap-[10px] mt-[10px]">
                          {/* @ts-ignore */}
                          {deal.documents.filter((docItem) => !docItem.documentType?.id).map((doc) => (
                            <div className="flex justify-between items-center" key={doc.title}>
                              <File
                                onSelect={() => null}
                                // @ts-ignore
                                file={{ file: doc.document }}
                                name={doc.name}
                              />
                              <div className='min-w-[24px] ml-[8px]'>
                                <RemoveIcon className="cursor-pointer" onClick={() => deleteDocument({dealId: deal?.id, docId: doc.id})} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <Space h={20} />
                      </div>
                    </div>
                  )
                }
              </>
            )
        }
      </SidebarLayout>
    </AppShell>
  )
}

export { EquipmentApplication }
