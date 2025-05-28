import React from 'react';
import classNames from 'classnames';
import { Pagination, Table } from '@box/shared/ui';
import { IWithClass } from '@types';
import { useGate, useStore, useUnit } from 'effector-react';
import { applicationModel } from '@box/entities/application';
import TrashIcon from '@assets/icons/24_delete.svg';
import { ApplicationDeleteButton, UsersEquipmentApplicationsListFilters } from '@box/features/application';
import { useOrdering, usePagination } from '@box/shared/lib/factories';
import { UsersEquipmentApplicationRow } from '@box/entities/application/ui/rows/userEquipmentApplicationRow';
import { UserEquipmentApplicationCard } from '@box/entities/application/ui/rows/userEquipmentApplicationCard';
import {
  pagination,
  gate,
  ordering
} from '../model';
import s from './style.module.scss';
import { headers } from '../lib';

export const UsersEquipmentApplicationsList: React.FC<IWithClass> = ({
  className
}) => {
  const applications = useStore(applicationModel.$equipmentApplications);
  const loading = useStore(applicationModel.equipmentApplicationsLoading.$loaderStore);
  const deleteApplication = useUnit(applicationModel.deleteEquipmentApplicationFx);
  const pag = usePagination(pagination);
  const ord = useOrdering(ordering);

  useGate(gate);
  return (
    <>
      <UsersEquipmentApplicationsListFilters />
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
            <UsersEquipmentApplicationRow
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
            <UserEquipmentApplicationCard
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
        <Pagination pagination={pagination} />
      </div>
    </>

  );
};
