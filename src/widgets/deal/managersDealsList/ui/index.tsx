import {useGate, useStore} from "effector-react"
import {
    $dealsNumber,
    $managerDeals,
    gate,
    managerDealsHeaders,
    managerDealsLoading,
    pagination,
    ordering
} from "@box/widgets/deal/managersDealsList";
import {Pagination, Table} from "@box/shared/ui";
import {useOrdering, usePagination} from "@box/shared/lib/factories";
import classNames from "classnames";
import s from "@box/widgets/companies/companiesVerificationsList/ui/style.module.scss";
import React from "react";
import {ManagerDealsRow} from "@box/entities/deal";

export const ManagerDealList = () => {
    const deals = useStore($managerDeals);
    const dealsCount = useStore($dealsNumber);
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);
    const loading = useStore(managerDealsLoading.$loaderStore)
    useGate(gate);
    return (
        <div>
            <Table
                loading={loading && pag.currentPage === 1}
                empty={deals.length === 0}
                className={classNames("mt-[20px]", s.table, s.table_view)}
                pagination={<Pagination pagination={pagination}/>}
            >
                <Table.Head
                    headers={managerDealsHeaders}
                    ordering={ord.ordering}
                    onOrderingChange={ord.setOrdering}
                />
                <Table.Body>
                    {deals.map((deal) => (
                        <ManagerDealsRow
                            deal={deal}
                            key={deal.id}
                        />
                    ))}
                </Table.Body>
            </Table>
            {
                dealsCount > 0 &&
                <div className="flex gap-4 cursor-pointer items-center float-right">
                    <p className="text-grey-50 text-sm whitespace-nowrap">Сделок</p>
                    <p>{dealsCount}</p>
                </div>
            }
        </div>
    )
}