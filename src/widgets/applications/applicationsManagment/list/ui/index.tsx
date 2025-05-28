import { useScreenSize } from "@box/shared/hooks";
import { useOrdering, usePagination } from "@box/shared/lib/factories";
import { IWithClass } from "@box/types";
import { useGate, useStore, useUnit } from "effector-react";
import { gate, gateEquipment, ordering, orderingEquipment, pagination, paginationEquipment } from "../model/store";
import { Pagination, Table } from "@box/shared/ui";
import s from './style.module.scss';
import { headers, headersEquipment } from '../lib';
import { Card, CardEquipment } from "./card";
import { applicationModel } from "@box/entities/application";
import classNames from "classnames";
import TrashIcon from '@assets/icons/24_delete.svg';
import { ApplicationDeleteButton } from "@box/features/application";
import {
    ApplicationsListManagementFilters,
    EquipmentApplicationsManagementListFilters } from "@box/features/applications-management/filters/applicationsModerationsFilter/ui";
import { ApplicationManagementRow, EquipmentApplicationManagementRow } from "@box/entities/application/ui/rows/applicationManagementRow";

export const ApplicationsManagementList: React.FC<IWithClass> = ({
    className
  }) => {
    const applications = useStore(applicationModel.$applications);
    const loading = useStore(applicationModel.applicationsLoading.$loaderStore);
    const deleteApplication = useUnit(applicationModel.deleteApplicationFx);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);
    const [, satisfies] = useScreenSize();

    useGate(gate);
    return (
      <>
        <ApplicationsListManagementFilters />
        {satisfies('md') ? (
          <Table
            loading={loading && pag.currentPage === 1}
            empty={applications.length === 0}
            className={classNames(className, s.table)}
            pagination={<Pagination pagination={pagination} />}
          >
            <Table.Head
              headers={headers}
              ordering={ord.ordering}
              onOrderingChange={ord.setOrdering}
            />
            <Table.Body>
              {applications.map((application) => (
                <ApplicationManagementRow
                  key={application.id}
                  application={application}
                  deleteButton={(
                    <ApplicationDeleteButton 
                      applicationId={application.id}
                      deleteApplication={deleteApplication}
                    >
                      <TrashIcon className="cursor-pointer" width={30} height={30} />
                    </ApplicationDeleteButton>
                  )}
                />
              ))}
            </Table.Body>
          </Table>
        )
          : (
            <div className={s.card_view}>
              <div className={classNames(s.card_view_block)}>
                {applications.map((application) => (
                  <Card
                    className={s.card_view_card}
                    key={application.id}
                    application={application}
                    deleteButton={(
                      <ApplicationDeleteButton
                        applicationId={application.id}
                        deleteApplication={deleteApplication}
                      >
                        <TrashIcon className="cursor-pointer" width={30} height={30} />
                      </ApplicationDeleteButton>
                    )}
                  />
                ))}
              </div>
              <Pagination pagination={pagination} />
            </div>
          )}
  
      </>
  
    );
};

export const EquipmentApplicationsManagementList: React.FC<IWithClass> = ({
  className
}) => {
  const applications = useStore(applicationModel.$equipmentApplications);
  const loading = useStore(applicationModel.equipmentApplicationsLoading.$loaderStore);
  const deleteApplication = useUnit(applicationModel.deleteEquipmentApplicationFx);
  const pag = usePagination(paginationEquipment);
  const ord = useOrdering(orderingEquipment);

  useGate(gateEquipment);
  return (
    <>
      <EquipmentApplicationsManagementListFilters />
      <Table
        loading={loading && pag.currentPage === 1}
        empty={applications.length === 0}
        className={classNames(className, s.table, s.table_view )}
        pagination={<Pagination pagination={paginationEquipment} />}
      >
        <Table.Head
          headers={headersEquipment}
          ordering={ord.ordering}
          onOrderingChange={ord.setOrdering}
        />
        <Table.Body>
          {applications.map((application) => (
            <EquipmentApplicationManagementRow
              key={application.id}
              application={application}
              deleteButton={(
                <ApplicationDeleteButton
                  applicationId={application.id}
                  aplicationType={application.equipment.name}
                  applicationDate={application.createdAt}
                  deleteApplication={deleteApplication}
                >
                  <TrashIcon className="cursor-pointer" width={30} height={30} />
                </ApplicationDeleteButton>
              )}
            />
          ))}
        </Table.Body>
      </Table>
      <div className={s.card_view}>
        <div className={classNames(s.card_view_block)}>
          {applications.map((application) => (
            <CardEquipment
              className={s.card_view_card}
              key={application.id}
              application={application}
              deleteIcon={(
                <ApplicationDeleteButton
                  applicationId={application.id}
                  aplicationType={application.equipment.name}
                  applicationDate={application.createdAt}
                  deleteApplication={deleteApplication}
                >
                  <TrashIcon className="cursor-pointer" width={30} height={30} />
                </ApplicationDeleteButton>
              )}
            />
          ))}
        </div>
        <Pagination pagination={paginationEquipment} />
      </div>
    </>

  );
};
  