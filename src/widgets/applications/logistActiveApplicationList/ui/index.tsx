import React from "react";
import { useGate, useStore } from "effector-react";
import classNames from "classnames";

import { Pagination, Table } from "@box/shared/ui";
import { useScreenSize } from "@box/shared/hooks";
import { logistActiveApplicationsListModel } from "@box/widgets/applications/logistActiveApplicationList";
import { useOrdering } from "@box/shared/lib/factories";
import { headers } from "../lib";
import { pagination } from "../model";

import s from "./style.module.scss";
import { ITransportApplicationsList } from "./types";
import { useRouter } from "next/router";
import { LogistActiveTransportApplicationListFilters } from "@box/features/application/filters/logistTransportDeals";
import { ActiveTransportApplicationRow } from "@box/entities/logistics/ui/rows/logistActiveTransportApplicationRow";
import { LogistActiveTransportApplicationCard } from "@box/entities/logistics/ui/rows/logistActiveTransportApplicationCard";

export const ActiveApplicationsList: React.FC<ITransportApplicationsList> = ({
  className,
}) => {
  const applications = useStore(
    logistActiveApplicationsListModel.$transportApplications
  );

  const loadingApplication = useStore(
    logistActiveApplicationsListModel.transportAppplicationsLoading.$loaderStore
  );

  const ord = useOrdering(logistActiveApplicationsListModel.ordering);
  const [, satisfies] = useScreenSize();
  const router = useRouter();

  useGate(logistActiveApplicationsListModel.gate);

  return (
    <div className={className}>
      <LogistActiveTransportApplicationListFilters />
      {satisfies("md") ? (
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
              <ActiveTransportApplicationRow
                application={application}
                key={application.id}
                onClick={() => {
                  (!!application.objectId && router.push(
                    `/${(
                      (
                        application.dealType === 'recyclablesdeal' ||
                        application.dealType === "transportapplication" ||
                        !application.dealType
                      ) &&
                      'profile/logistics'
                    ) ||
                    (application.dealType === 'equipmentdeal' && 'profile/equipment-logistics')}/${application.objectId}`
                  )) ||
                  router.push(`/profile/transport/${application.id}`);
                }}
                status={application.status.id}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className={s.card_view}>
          <div className={classNames(s.card_view_block)}>
            {applications.map((application) => (
              <LogistActiveTransportApplicationCard
                className={s.card_view_card}
                key={application.id}
                application={application}
              />
            ))}
          </div>
          <Pagination pagination={pagination} />
        </div>
      )}
    </div>
  );
};
