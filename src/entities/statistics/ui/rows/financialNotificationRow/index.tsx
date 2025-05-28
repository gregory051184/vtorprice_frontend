import React from "react";
import classNames from "classnames";
import { Table } from "@box/shared/ui";
import { IFinancialNotificationRow } from "./types";

export const FinancialNotificationRow: React.FC<IFinancialNotificationRow> = ({
  notification,
}) => {
  return (
    <Table.Row
      isHover={false}
      className={classNames(
        { "bg-green-light": !notification.isRead },
        "h-[69px] cursor-pointer"
      )}
      onClick={() => {
        window.open(
          `${process.env.NEXT_PUBLIC_API_URL}${notification.paymentOrder[0]?.document}`
        );
      }}
    >
      <Table.Cell>
        <p className="font-semibold text-lg">
          {notification.paymentOrder[0]?.total} ₽
        </p>
      </Table.Cell>
      <Table.Cell>
        <p className="font-medium">
          {notification.paymentOrder[0]?.name || "-"}
        </p>
      </Table.Cell>
      <Table.Cell align="right">
        <p className="font-semibold text-lg">
          {notification.paymentOrder[0] &&
            new Intl.DateTimeFormat("ru-RU", {
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            }).format(new Date(notification.paymentOrder[0].createdAt))}
        </p>
        <p className="text-grey-50 text-xs">
          {notification.paymentOrder[0] &&
            new Intl.DateTimeFormat("ru-RU", {
              month: "long",
              day: "2-digit",
              hour12: false,
            }).format(new Date(notification.paymentOrder[0].createdAt))}
        </p>
      </Table.Cell>
    </Table.Row>
  );
};
