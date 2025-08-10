import {useGate, useStore, useStoreMap} from "effector-react";
import {$companies, $statusCompaniesNumber, companiesLoading} from "@box/entities/company/model";
import {gate, pagination, ordering} from "@box/widgets/companies/companiesList/model";
import {useOrdering, usePagination} from "@box/shared/lib/factories";
import React, {useEffect, useState} from "react";
import {IWithClass, ROLE} from "@types";
import {Button, Pagination, Table, Tip} from "@box/shared/ui";
import classNames from "classnames";
import s from "@box/widgets/companies/companiesVerificationsList/ui/style.module.scss";
import {statusHeaders} from "@box/widgets/companies/companiesVerificationsList/lib";
import {CompanyChangeStatusRow} from "@box/entities/company";
import {$authStore} from "@box/entities/auth";
import {ManagerDealList} from "@box/widgets/deal/managersDealsList";
import {ManagersDealsFilter} from "@box/features/deal";


export const CompaniesChangeStatusList: React.FC<IWithClass> = ({
                                                                    className
                                                                }) => {
    const companies = useStore($companies)
    const companiesCount = useStore($statusCompaniesNumber)
    const pag = usePagination(pagination);
    const ord = useOrdering(ordering);
    const loading = useStore(companiesLoading.$loaderStore)
    const [showManagerDeals, setShowManagerDeals] = useState<boolean>(false);
    const [orderingChecking, setOrderingChecking] = useState<string | null>(null);
    const user = useStoreMap({
        store: $authStore,
        keys: ['user'],
        fn: (val) => val.user
    });

    const firstPageHandler = () => {
        pag.setFirstPage()
    }

    const orderingHandler = (order: string) => {
        ord.setOrdering(order)
        if (ord.ordering !== orderingChecking) {
            //pag.setFirstPage()
            setOrderingChecking(order)
            return 1
        }
        return 0
    }

    useGate(gate)

    useEffect(() => {
    }, [orderingChecking, companies, companiesCount]);
    return (
        <div className={className}>
            <Tip>
                Название компании красного цвета - значит у компании в карточке
                просрочены изменения контрактов на поставку (2/1) или вообще нет этих контрактов (Нет/)
            </Tip>
            <Table
                //@ts-ignore
                //loading={loading && (orderingHandler(ord.ordering) > 0 || pag.currentPage === 1)}
                loading={loading && pag.currentPage === 1}
                empty={companies.length === 0}
                className={classNames("mt-[20px]", s.table, s.table_view)}
                pagination={<Pagination pagination={pagination}/>}
            >
                <Table.Head
                    headers={(user && user?.role.id < ROLE.MANAGER) ? statusHeaders : statusHeaders.slice(0, 3)}
                    ordering={ord.ordering}
                    onOrderingChange={(e) => {
                        firstPageHandler()
                        ord.setOrdering(e)
                    }}
                />
                <Table.Body>
                    {user && companies.map((company) => (
                        <CompanyChangeStatusRow
                            company={company}
                            user={user}
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
            {(user && user?.role?.id < ROLE.MANAGER) &&
                <Button
                    className="mt-8"
                    type="micro"
                    mode="light"
                    fullWidth
                    onClick={() => {
                        setShowManagerDeals(!showManagerDeals);
                    }}>
                    {!showManagerDeals ? "Показать сделки менеджеров" : "Скрыть сделки"}
                </Button>}

            {showManagerDeals &&
                <div className="mt-8">
                    {/*<ManagersCompaniesListFiltersSearch/>*/}
                    <h3>
                        Сделки менеджеров
                    </h3>
                    <ManagersDealsFilter/>
                    <ManagerDealList/>
                </div>
            }
        </div>
    )
}