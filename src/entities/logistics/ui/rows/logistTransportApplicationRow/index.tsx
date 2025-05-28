import React from "react";
import { Table, TextClamp } from "@box/shared/ui";
import { ITransportApplicationRow } from "./types";
import { ColorStatus } from "@box/shared/ui/colorStatus";
import { useStore } from "effector-react";
import { $authStore } from "@box/entities/auth";
import { ROLE } from "@box/types";
import { logistTransportApplicationStatusSelectValues } from "@box/entities/logistics/lib";

export const TransportApplicationRow: React.FC<ITransportApplicationRow> = ({
  application,
  status,
  onClick
}) => {
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

  const ammountOfDelivery = () => {
    if (application.myOffer) {
      return `${application.myOffer.amount} ₽`;
    }
    if (application.approvedLogisticsOffer) {
      return `${application.approvedLogisticsOffer.amount} ₽`;
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

  return (
    <Table.Row
      className="cursor-pointer font-medium h-[88px]"
      onClick={onClick}
    >
      <Table.Cell className="pr-4 max-w-[130px]">
        <p>{application.cargoType}</p>
      </Table.Cell>
      <Table.Cell className="max-w-[120px] pr-[20px]">
        <TextClamp>{application.shippingAddress}</TextClamp>
      </Table.Cell>
      <Table.Cell className="max-w-[120px] pr-[20px]">
        <TextClamp>{application.deliveryAddress}</TextClamp>
      </Table.Cell>
      <Table.Cell className="w-[50px] pr-[10px]">
        <p>{shippingDate()}</p>
      </Table.Cell>
      <Table.Cell className="w-[50px] pr-[10px]">
        <p>{ammountOfDelivery()}</p>
      </Table.Cell>
      <Table.Cell>
        <ColorStatus status={statusOfApplication()} />
      </Table.Cell>
    </Table.Row>
  );
};
