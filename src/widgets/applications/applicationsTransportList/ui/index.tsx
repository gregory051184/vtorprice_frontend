import React from "react";
import { useGate, useStore } from "effector-react";
import classNames from "classnames";

import { Pagination, Table } from "@box/shared/ui";
import { LogistTransportApplicationListFilters } from "@box/features/application/filters/logistTransportApplication";
import { transportApplicationsListModel } from "@box/widgets/applications/applicationsTransportList";
import { useOrdering } from "@box/shared/lib/factories";
import {
  LogistTransportApplicationCard,
  TransportApplicationRow,
} from "@box/entities/logistics";
import { headers } from "../lib";
import { pagination } from "../model";

import s from "./style.module.scss";
import { ITransportApplicationsList } from "./types";
import { useRouter } from "next/router";
import { $authStore } from "@box/entities/auth";
import { ROLE } from "@box/types";

export const TransportApplicationsList: React.FC<
  ITransportApplicationsList
> = ({ className, itemLink }) => {
  const applications = useStore(
    transportApplicationsListModel.$transportApplications
  );

  const loadingApplication = useStore(
    transportApplicationsListModel.transportAppplicationsLoading.$loaderStore
  );
  const { user } = useStore($authStore);

  useGate(transportApplicationsListModel.gate);
  const ord = useOrdering(transportApplicationsListModel.ordering);
  const router = useRouter();

  return (
    <div className={className}>
      <LogistTransportApplicationListFilters />
      <Table
        separate
        pagination={<Pagination pagination={pagination} />}
        loading={loadingApplication}
        empty={applications.length === 0}
        className={classNames("mt-[14px]", s.table_view, className)}
      >
        <Table.Head
          headers={headers}
          ordering={ord.ordering}
          onOrderingChange={ord.setOrdering}
        />
        <Table.Body>
          {applications.map((application) => (
            <TransportApplicationRow
              application={application}
              key={application.id}
              onClick={() => {
                (!!application.objectId && router.push(
                  `/${(
                    (
                      application.dealType === 'recyclablesdeal' ||
                      application.dealType === "transportapplication" ||
                      !application.dealType ||
                      router.pathname.includes('/profile/transport-applications')
                    ) &&
                    itemLink
                  ) ||
                  (application.dealType === 'equipmentdeal' && 'profile/equipment-logistics')}/${
                    user?.role.id !== ROLE.LOGIST
                      ? application.objectId
                      : application.id
                  }`
                )) ||
                (router.pathname.includes('/profile/transport-applications') && router.push(`/${itemLink}/${application.id}`)) ||
                router.push(`/profile/transport/${application.id}`);
              }}
              status={{
                logistStatus: application.logistStatus,
                status: application.status,
              }}
            />
          ))}
        </Table.Body>
      </Table>
      <div className={s.card_view}>
        <div className={classNames(s.card_view_block)}>
          {applications.map((application) => (
            <LogistTransportApplicationCard
              className={s.card_view_card}
              key={application.id}
              application={application}
              link={itemLink}
              status={{
                logistStatus: application.logistStatus,
                status: application.status,
              }}
            />
          ))}
        </div>
        <Pagination pagination={pagination} />
      </div>
    </div>
  );
};
