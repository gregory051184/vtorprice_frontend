import React from "react";
import { Table } from "@box/shared/ui";
import { ITransportApplicationRow } from "./types";
import { ColorStatus } from "@box/shared/ui/colorStatus";
import { transportApplicationStatusSelectValues } from "@box/entities/logistics/lib";

export const ActiveTransportApplicationRow: React.FC<
  ITransportApplicationRow
> = ({ application, status, onClick }) => {
  const statusOfApplication = () => {
    const findStatus = transportApplicationStatusSelectValues.find(
      (item) => item.id === status
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
    <Table.Row
      className="cursor-pointer font-medium h-[88px]"
      onClick={onClick}
    >
      <Table.Cell className="pr-4 max-w-[130px]">
        <p>{application.cargoType}</p>
      </Table.Cell>
      <Table.Cell className="pr-[20px]">
        <p>{application.myOffer?.contractor.name || "-"}</p>
      </Table.Cell>
      <Table.Cell className="w-[50px] pr-[10px]">
        <p>
          {application?.myOffer?.shippingDate
            ? new Intl.DateTimeFormat("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour12: false,
              }).format(new Date(application.myOffer.shippingDate))
            : "-"}
        </p>
      </Table.Cell>
      <Table.Cell className="w-[50px] pr-[10px]">
        <p>{application?.myOffer?.amount || "-"}</p>
      </Table.Cell>
      <Table.Cell>
        <ColorStatus status={statusOfApplication()} />
      </Table.Cell>
    </Table.Row>
  );
};
