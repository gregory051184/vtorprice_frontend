import React from "react";
import { Separator } from "@box/shared/ui";
import classNames from "classnames";
import Link from "next/link";
import { ITransportApplicationCard } from "./types";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { ROLE } from "@box/types";
import { logistTransportApplicationStatusSelectValues } from "@box/entities/logistics/lib";
import { ColorStatus } from "@box/shared/ui/colorStatus";

export const LogistTransportApplicationCard: React.FC<
  ITransportApplicationCard
> = ({ application, className, status, link }) => {
  const { user } = useStore($authStore);

  const shippingDate = () => {
    if (application.myOffer) {
      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
      }).format(new Date(application.myOffer.shippingDate));
    }
    if (application.approvedLogisticsOffer) {
      return new Intl.DateTimeFormat("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour12: false,
      }).format(new Date(application.approvedLogisticsOffer.shippingDate));
    }
    return "-";
  };

  const statusOfApplication = () => {
    if (user?.role.id === ROLE.LOGIST) {
      const statusOfApplication =
        logistTransportApplicationStatusSelectValues.find(
          (item) => item.id === status.logistStatus
        );
      if (status.logistStatus && statusOfApplication) {
        return {
          id: status.logistStatus,
          label: statusOfApplication.label,
          logist: true,
        };
      }
      return {
        id: 0,
        label: "",
        logist: true,
      };
    }
    return status.status;
  };

  const ammountOfDelivery = () => {
    if (application.myOffer) {
      return `${application.myOffer.amount} ₽`;
    }
    if (application.approvedLogisticsOffer) {
      return `${application.approvedLogisticsOffer.amount} ₽`;
    }
    return "-";
  };

  return (
    <Link
      href={!!application.objectId ? `/${link}/${application.objectId}` : {}}
      className={classNames("p-[16px] bg-grey-10 rounded-[10px]", className)}
    >
      <>
        <div className="flex justify-between font-medium">
          <div>
            <p>{application.cargoType}</p>
          </div>
          <div>
            <p>{ammountOfDelivery()}</p>
          </div>
        </div>
        <Separator h={16} />
        <div className="flex flex-wrap flex-col">
          <div className="flex flex-col">
            <div className="w-full flex gap-[10px]">
              <p className="text-[10px] text-grey-40 w-full">Откуда</p>
              <p className="text-[10px] text-grey-40 w-full">Адрес</p>
            </div>
            <div className="w-full flex items-center gap-[10px]">
              <p className="text-[14px] mt-[4px] w-full">
                {application?.shippingCity?.name || "-"}
              </p>
              <p className="text-[14px] mt-[4px] w-full">
                {application?.shippingAddress}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="w-full flex gap-[10px]">
              <p className="text-[10px] text-grey-40 w-full">Куда</p>
              <p className="text-[10px] text-grey-40 w-full">Адрес</p>
            </div>
            <div className="w-full flex items-center gap-[10px]">
              <p className="text-[14px] mt-[4px] w-full">
                {application?.deliveryCity?.name || "-"}
              </p>
              <p className="text-[14px] mt-[4px] w-full">
                {application?.deliveryAddress}
              </p>
            </div>
          </div>
        </div>
        <Separator h={16} />
        <div className="flex justify-between items-center flex-wrap">
          <div className="text-[14px] text-grey-40">{shippingDate()}</div>
          <div className="text-[14px]">
            <ColorStatus status={statusOfApplication()} />
          </div>
        </div>
      </>
    </Link>
  );
};
