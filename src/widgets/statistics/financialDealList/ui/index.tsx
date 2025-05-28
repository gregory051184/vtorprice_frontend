import React from "react";
import { useGate, useStore } from "effector-react";

import { Pagination, Table } from "@box/shared/ui";
import { IWithClass } from "@box/types";
import { FinancialNotificationRow } from "@box/entities/statistics/ui/rows/financialNotificationRow";

import { headers } from "../lib";
import {
  $notificationsList,
  gate,
  notificationsLoading,
  pagination,
} from "../model";

import s from "./style.module.scss";
import { useScreenSize } from "@box/shared/hooks";
import { FinancialNotificationCard } from "@box/entities/statistics/ui/rows/financialNotificationCard";

export const FinancialDealsList: React.FC<IWithClass> = ({ className }) => {
  useGate(gate);
  const notifications = useStore($notificationsList);
  const loading = useStore(notificationsLoading.$loaderStore);
  const [, satisfies] = useScreenSize();

  return (
    <div className={className}>
      {satisfies("xsm") ? (
        <Table
          separate
          loading={loading}
          pagination={<Pagination pagination={pagination} />}
          empty={notifications.length === 0}
          className={s.table_view}
        >
          <Table.Head className={s.head} headers={headers} />
          <Table.Body>
            {notifications.map((notification) => (
              <FinancialNotificationRow
                notification={notification}
                key={notification.id}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6">
            {notifications.map((notification) => (
              <FinancialNotificationCard
                notification={notification}
                key={notification.id}
              />
            ))}
          </div>
          <Pagination pagination={pagination} />
        </>
      )}
    </div>
  );
};
