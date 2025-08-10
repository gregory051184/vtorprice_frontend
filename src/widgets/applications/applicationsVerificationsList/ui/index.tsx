import React from 'react';
import classNames from 'classnames';
import {Pagination, Table} from '@box/shared/ui';
import {IWithClass} from '@types';
import {useGate, useStore} from 'effector-react';
import {ApplicationVerificationRow, applicationModel} from '@box/entities/application';
import {useOrdering, usePagination} from '@box/shared/lib/factories';
import {
    gate,
    pagination,
    ordering
} from '../model';
import s from './style.module.scss';
import {headers} from '../lib';
import {$applicationsNumber} from "@box/entities/application/model";

export const ApplicationsVerificationsList: React.FC<IWithClass> = ({
                                                                        className
                                                                    }) => {
    const applications = useStore(applicationModel.$applications);
    const loading = useStore(applicationModel.applicationsLoading.$loaderStore);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);
    const applicationsCount = useStore($applicationsNumber)
    useGate(gate);
    return (
        <div>
            <Table
                empty={applications.length === 0}
                className={classNames(s.table, className)}
                loading={loading && pag.currentPage === 1}
                pagination={<Pagination pagination={pagination}/>}
            >
                <Table.Head headers={headers} ordering={ord.ordering} onOrderingChange={ord.setOrdering}
                            className={s.isHiddenForAdaptive}/>
                <Table.Body className={s.adaptive}>
                    {applications.map((application) => (
                        <ApplicationVerificationRow application={application} key={application.id}/>
                    ))}
                </Table.Body>
            </Table>
            {
                applicationsCount > 0 &&
                <div className="flex gap-4 cursor-pointer items-center float-right">
                    <p className="text-grey-50 text-sm whitespace-nowrap">Заявок на верификацию</p>

                    <p>{applicationsCount}</p>
                </div>
            }
        </div>
    );
};
