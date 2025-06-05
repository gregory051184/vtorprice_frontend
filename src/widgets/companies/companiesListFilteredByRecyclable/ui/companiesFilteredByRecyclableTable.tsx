import {
    Table
} from '@box/shared/ui';
import React from 'react';
import {CompanyFilteredByRecyclableRow} from '@box/entities/company';
import {headers} from '../lib';
import s from './style.module.scss';
import {
    ICompanyFilteredByRecyclableTable
} from "@box/widgets/companies/companiesListFilteredByRecyclable";

export const CompaniesFilteredByRecyclableTable: React.FC<ICompanyFilteredByRecyclableTable> = ({
                                                                                                    className,
                                                                                                    companies
                                                                                                }) => {
    return (
        <div className={className}>
            <Table
                empty={companies.length === 0}
                className={s.table_view}
            >
                <Table.Head
                    headers={headers}

                />
                <Table.Body>
                    {companies.map((item) => (
                        <CompanyFilteredByRecyclableRow
                            company={item?.company}
                            lastPrice={item?.lastPrice}
                            volume={item?.volume}
                            key={item?.company?.id}
                        />
                    ))}
                </Table.Body>
            </Table>
            {/*<div className={s.card_view}>
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
            </div>*/}
        </div>
    );
};
