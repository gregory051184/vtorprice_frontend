import {
    Pagination, Table
} from '@box/shared/ui';
import {IWithClass} from '@box/types';
import React from 'react';
import {useGate, useStore, useUnit} from 'effector-react';
import {CompanyRow, companyModel, CompanyCard} from '@box/entities/company';
import {useOrdering, usePagination} from '@box/shared/lib/factories';
import classNames from 'classnames';
import {headers} from '../lib';
import {gate, pagination, ordering as od} from '../model';
import s from './style.module.scss';

export const CompaniesTable: React.FC<IWithClass> = ({className}) => {

    const companies = useStore(companyModel.$companies);
    const loading = useStore(companyModel.companiesLoading.$loaderStore);
    const updateInFavorite = useUnit(companyModel.updateCompanyInFavoriteEvent);
    const pag = usePagination(pagination);
    const ordering = useOrdering(od);

    useGate(gate);

    const handleChangeInFavorite = (
        id: number,
        event?: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event) {
            event.stopPropagation();
        }
        updateInFavorite({id});
    };

    return (
        <div className={className}>
            <Table
                pagination={
                    <Pagination pagination={pagination}/>

                }
                loading={loading && pag.currentPage === 1}
                empty={companies.length === 0}
                className={s.table_view}
            >
                <Table.Head
                    headers={headers}
                    ordering={ordering.ordering}
                    onOrderingChange={ordering.setOrdering}
                />
                <Table.Body>
                    {companies.map((company) => (
                        <CompanyRow
                            company={company}
                            key={company.id}
                            onClickInFavorite={handleChangeInFavorite}
                        />
                    ))}
                </Table.Body>
            </Table>
            <div className={s.card_view}>
                <div className={classNames(s.card_view_block)}>
                    {companies.map((company) => (
                        <CompanyCard
                            className={s.card_view_card}
                            key={company.id}
                            company={company}
                            onClickInFavorite={() => handleChangeInFavorite(company.id)}
                        />
                    ))}
                </div>
                <Pagination pagination={pagination}/>
            </div>
        </div>
    );
};
