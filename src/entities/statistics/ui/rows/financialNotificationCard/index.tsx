import React from "react";
import classNames from "classnames";
import { IFinancialNotificationCard } from "./types";

export const FinancialNotificationCard: React.FC<IFinancialNotificationCard> = ({
  notification,
}) => (
  <div
    className={classNames("py-4 px-6 bg-grey-10 rounded-[10px]", {
      "bg-green-light": !notification.isRead,
    })}
  >
    <div className="flex justify-between gap-2">
      <p className="text-xs">Платежное уведомление №{notification.id}</p>
      <div>
        <p className="font-semibold text-lg">{notification.amount} ₽</p>
        <p className="">
          {new Intl.DateTimeFormat("ru-RU", {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }).format(new Date(notification.createdAt))}
        </p>
        <p className="text-grey-50 text-xs">
          {new Intl.DateTimeFormat("ru-RU", {
            month: "long",
            day: "2-digit",
            hour12: false,
          }).format(new Date(notification.createdAt))}
        </p>
      </div>
    </div>
  </div>
);
