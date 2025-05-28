import React from "react";
import { Separator } from "@box/shared/ui";
import classNames from "classnames";
import Link from "next/link";
import { IActiveTransportApplicationCard } from "./types";
import { transportApplicationStatusSelectValues } from "@box/entities/logistics/lib";
import { ColorStatus } from "@box/shared/ui/colorStatus";

export const LogistActiveTransportApplicationCard: React.FC<
  IActiveTransportApplicationCard
> = ({ application, className }) => {
  const statusOfApplication = () => {
    const findStatus = transportApplicationStatusSelectValues.find(
      (item) => item.id === application.status.id
    );
    if (findStatus) {
      return {
        id: +findStatus.id,
        label: findStatus.label,
        logist: true,
      };
    }
    return {
      id: 0,
      label: "",
      logist: true,
    };
  };

  return (
    <Link
      href={
        (!!application.objectId &&
          `/${(
            (
              application.dealType === 'recyclablesdeal' ||
              application.dealType === "transportapplication" ||
              !application.dealType
            ) &&
            'profile/logistics'
          ) ||
          (application.dealType === 'equipmentdeal' && 'profile/equipments-logistics')}/${application.objectId}`
        ) ||
        `/profile/transport/${application.id}`
      }
      className={classNames("p-[16px] bg-grey-10 rounded-[10px]", className)}
    >
      <>
        <div className="flex justify-between font-medium">
          <p>{application.cargoType}</p>
          <p>{application.myOffer?.amount ? `${application.myOffer?.amount} ₽` : "-"}</p>
        </div>
        <Separator h={16} />
        <div className="font-medium">
          <p>{application.myOffer?.contractor.name || "-"}</p>
        </div>
        <Separator h={16} />
        <div className="flex justify-between">
          <p className="text-sm text-grey-40">
            {application?.myOffer?.shippingDate
              ? new Intl.DateTimeFormat("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour12: false,
                }).format(new Date(application?.myOffer?.shippingDate))
              : "-"}{" "}
          </p>
          <ColorStatus status={statusOfApplication()} />
        </div>
      </>
    </Link>
  );
};
