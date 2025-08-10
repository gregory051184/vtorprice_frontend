import React from 'react';
import {Pagination, Table} from '@box/shared/ui';
import {useEvent, useStore} from 'effector-react';
import {ApplicatiosFromUsersRow} from '@box/entities/application';
import {IApplicationsFromUsersListTemplate} from './types';
import {headers} from '../../lib';

export const ApplicationsFromUsersListTemplate: React.FC<IApplicationsFromUsersListTemplate> = ({
                                                                                                    className,
                                                                                                    applications: appl,
                                                                                                    pagination,
                                                                                                    title,
                                                                                                    selected,
                                                                                                    setSelected,
                                                                                                }) => {
    const applications = useStore(appl);
    const selectedApplication = useStore(selected);
    const setSelectedApplication = useEvent(setSelected);
    return (
        <div className={className}>
            <h3
                className="text-xl mb-[10px] ml-[14px]">
                {applications.length > 0 ? `${title} - ${applications.length} заявок` : `${title}`}</h3>
            <div className="max-h-[510px] overflow-auto">
                <Table
                    pagination={<Pagination pagination={pagination}/>}
                    empty={applications.length === 0}
                >
                    <Table.Head className="sticky top-0 bg-white" headers={headers}/>
                    <Table.Body>
                        {applications.map((application) => (
                            <ApplicatiosFromUsersRow
                                selected={selectedApplication === application.id}
                                onSelect={(val) => val && setSelectedApplication(application.id)}
                                key={application.id}
                                application={application}
                            />
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
};
