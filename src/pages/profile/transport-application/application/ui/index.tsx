import React, { useEffect } from "react";
import { useEvent, useGate, useStore } from "effector-react";
import { BackButton, TabSelect } from "@box/shared/ui";
import { AppShell, SidebarLayout } from "@box/layouts";
import { Header } from "@box/widgets/header";
import { Footer } from "@box/widgets/footer";
import { transportApplicationModel } from "@box/entities/logistics";
import { CreateTransportApplicationOfferForm } from "@box/features/logistics/forms/createTransportApplicationOffer";
import Check from "@assets/icons/Check.svg";
import { ChatWidget } from "@box/widgets/chats";
import { useRouter } from "next/router";
import { $authStore } from "@box/entities/auth";
import { ROLE } from "@box/types";
import { SubmitTransportApplicationOfferForm } from "@box/features/logistics";
import { $offer, getLogisticsOfferFx } from "../model";

export const LogistTransportApplication = () => {
  const application = useStore(transportApplicationModel.$transportApplication);
  const { query } = useRouter();
  const { user } = useStore($authStore);
  const getOffer = useEvent(getLogisticsOfferFx);
  const offer = useStore($offer);

  const applicationId = parseInt(query.id as string, 10);

  useGate(transportApplicationModel.gate, { id: applicationId });

  const chatId = application?.myOffer?.chat?.id ||
    application?.approvedLogisticsOffer?.chat?.id ||
    offer?.chat?.id;
  const logistOffer = application?.myOffer;

  useEffect(() => {
    if (query.offer && query.id) {
      getOffer({
        offer_id: query.offer as string,
        application_id: query.id as string,
      });
    }
  }, [query.offer, query.id]);

  return (
    <AppShell header={<Header />} footer={<Footer />}>
      <SidebarLayout>
        <BackButton>
          <p>Назад к сделке</p>
        </BackButton>
        {application && (
          <div className="mt-[20px]">
            <h1 className="text-3xl mb-5">Предложение по логистике</h1>
            {
              //@ts-ignore
              (user?.role.id === ROLE.COMPANY_ADMIN || user?.role.id <= ROLE.MANAGER) && offer && (
              <SubmitTransportApplicationOfferForm offer={offer} />
            )}
            {user?.role.id === ROLE.LOGIST && (
              <CreateTransportApplicationOfferForm logistOffer={logistOffer} />
            )}
            {chatId && <ChatWidget chatId={chatId} mini />}
            <div className="border border-solid border-grey-20 border-3 rounded-[20px] py-5 px-8 mt-7">
              <div>
                <div className="flex">
                  <div className="mb-6 w-[400px] pr-5">
                    <p className="text-xs text-grey-30 mb-1">Отправитель</p>
                    <p className="">{application.sender}</p>
                  </div>
                  <div className="mb-6 w-[400px] pr-5">
                    <p className="text-xs text-grey-30 mb-1">Получатель</p>
                    <p>{application.recipient}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs text-grey-30 mb-1">Номер телефона</p>
                  <p>-</p>
                </div>
                <div className="flex">
                  <div className="mb-6 w-[400px] pr-5">
                    <p className="text-xs text-grey-30 mb-1">
                      Адрес погрузки <span className="text-red-dark">*</span>
                    </p>
                    <p>{application.deliveryAddress}</p>
                  </div>
                  <div className="mb-6 w-[400px]">
                    <p className="text-xs text-grey-30 mb-1">
                      Адрес выгрузки <span className="text-red-dark">*</span>
                    </p>
                    <p>{application.shippingAddress}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mb-6 w-[400px]">
                    <p className="text-xs text-grey-30 mb-1">
                      Характер груза <span className="text-red-dark">*</span>
                    </p>
                    <p>{application.cargoType}</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-grey-30 mb-1">Вес, т *</p>
                    <p>{(application.weight / 1000).toFixed(1)}</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex justify-between w-[400px] pr-8">
                    <div className="mb-6 mr-3">
                      <p className="text-xs text-grey-30 mb-1">Часы погрузки</p>
                      <p>{application.loadingHours}</p>
                    </div>
                    <div className="mb-6">
                      <p className="text-xs text-grey-30 mb-2">
                        Работа в выходные
                      </p>
                      <p>{!application.weekendWork ? <Check /> : "Нет"}</p>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-xs text-grey-30 mb-1 pr-2">
                      Формат погрузки
                    </p>
                    <TabSelect
                      className="bg-grey-10"
                      values={[
                        { id: 1, label: "Зад", value: 1 },
                        { id: 2, label: "Бок", value: 2 },
                        { id: 3, label: "Верх", value: 3 },
                      ]}
                      value={{
                        id: application.loadingType.id,
                        label: application.loadingType.label,
                        value: application.loadingType.id,
                      }}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs text-grey-30 mb-1">Комментарий</p>
                  <p>{application.comment || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarLayout>
    </AppShell>
  );
};
