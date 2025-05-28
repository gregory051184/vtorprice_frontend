import React from 'react';
import classNames from 'classnames';
import { Pagination, Table } from '@box/shared/ui';
import { IWithClass } from '@types';
import { useGate, useStore, useUnit } from 'effector-react';
import { applicationModel, UsersApplicationRow } from '@box/entities/application';
import TrashIcon from '@assets/icons/24_delete.svg';
import { ApplicationDeleteButton, UsersApplicationsListFilters } from '@box/features/application';
import { useOrdering, usePagination } from '@box/shared/lib/factories';
import { useScreenSize } from '@box/shared/hooks';
import {
  pagination,
  gate,
  ordering
} from '../model';
import s from './style.module.scss';
import { headers } from '../lib';
import { Card } from "./card";

export const UsersApplicationsList: React.FC<IWithClass> = ({
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
      <UsersApplicationsListFilters />
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
              <UsersApplicationRow
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
