import {Pagination, Table} from '@box/shared/ui';
import {IWithClass} from '@box/types';
import {useGate, useStore} from 'effector-react';
import React from 'react';
import classNames from 'classnames';
import {CompanyVerificationRow} from '@box/entities/company';
import {companyVerificationModel} from '@box/entities/companyVerification';
import {usePagination} from '@box/shared/lib/factories';
import {headers} from '../lib';
import {pagination, gate} from '../model';
import s from './style.module.scss';
import {CompanyCardForVerification} from '@box/entities/company/ui/rows/companyCardForVerifacation';

export const CompaniesVerificationsList: React.FC<IWithClass> = ({
                                                                     className
                                                                 }) => {
    const loading = useStore(companyVerificationModel.companiesVerificationsLoading.$loaderStore);
    const pag = usePagination(pagination);
    useGate(gate);
    const companiesVerifications = useStore(companyVerificationModel.$companiesVerifications);
    return (
        <div className={className}>
            <Table
                loading={loading && pag.currentPage === 0}
                empty={companiesVerifications.length === 0}
                className={classNames("mt-[20px]", s.table, s.table_view)}
                pagination={<Pagination pagination={pagination}/>}
            >
                <Table.Head>
                    <Table.Row>
                        {headers.map((header) => (
                            <Table.Cell key={header.key}>
                                {header.title}
                            </Table.Cell>
                        ))}
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {companiesVerifications.map((companyVerification) => (
                        <CompanyVerificationRow
                            companyVerification={companyVerification}
                            key={companyVerification.id}
                        />
                    ))}
                </Table.Body>
            </Table>
            <div className={s.card_view}>
                <div className={classNames(s.card_view_block)}>
                    {companiesVerifications.map((company) => (
                        <CompanyCardForVerification
                            className={s.card_view_card}
                            key={company.id}
                            company={company.company}
                            companyVerification={company}
                        />
                    ))}
                </div>
                <Pagination pagination={pagination}/>

            </div>
        </div>
    );
};
