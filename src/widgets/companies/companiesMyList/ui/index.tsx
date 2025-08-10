import {Pagination, Table} from '@box/shared/ui';
import {IWithClass} from '@box/types';
import React, {useEffect} from 'react';
import classNames from 'classnames';
import {useGate, useStore} from 'effector-react';
import {useOrdering} from '@box/shared/lib/factories';
import {useScreenSize} from '@box/shared/hooks';
import {MyCompanyCard} from '@box/entities/company/ui/rows/myCompanyCard';
import {ManagerMyCompaniesListFilters} from '@box/features/company/filters/myCompanies';
import {myCompaniesListModel} from '@box/widgets/companies/companiesMyList';
import {MyCompanyRow} from '@box/entities/company/ui/rows/myCompanyRow';
import {headers} from '../lib';

import s from './style.module.scss';
import {$companiesNumber} from "@box/widgets/companies/companiesMyList/model";

export const ManagerMyCompaniesList: React.FC<IWithClass> = ({className}) => {
    const myCompanies = useStore(myCompaniesListModel.$myCompaniesList);
    const ord = useOrdering(myCompaniesListModel.ordering);
    const loadingCompanies = useStore(
        myCompaniesListModel.myCompaniesLoading.$loaderStore
    );
    const companiesCount = useStore($companiesNumber)
    useGate(myCompaniesListModel.gate);
    const [, satisfies] = useScreenSize();
    return (
        <div className={className}>
            <ManagerMyCompaniesListFilters/>
            {satisfies('md')
                ? (
                    <div>
                        <Table
                            separate
                            pagination={<Pagination pagination={myCompaniesListModel.pagination}/>}
                            loading={loadingCompanies}
                            empty={myCompanies.length === 0}
                            className={classNames(s.table_view, 'mt-[14px]')}
                        >
                            <Table.Head
                                className={s.head}
                                headers={headers}
                                ordering={ord.ordering}
                                onOrderingChange={ord.setOrdering}
                            />
                            <Table.Body>
                                {myCompanies.map((company) => (
                                    <MyCompanyRow
                                        company={company}
                                        key={company.id}
                                    />
                                ))}

                            </Table.Body>
                        </Table>
                        {
                            companiesCount > 0 &&
                            <div className="flex gap-4 cursor-pointer items-center float-right">
                                <p className="text-grey-50 text-sm whitespace-nowrap">Компаний</p>

                                <p>{companiesCount}</p>
                            </div>
                        }
                    </div>
                ) : (
                    <div className={s.card_view}>
                        <div className={classNames(s.card_view_block)}>
                            {myCompanies.map((company) => (
                                <MyCompanyCard
                                    className={s.card_view_card}
                                    key={company.id}
                                    company={company}
                                />
                            ))}
                        </div>
                        <Pagination pagination={myCompaniesListModel.pagination}/>
                    </div>
                )}
        </div>
    );
};
