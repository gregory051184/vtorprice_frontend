import React, {useEffect, useState} from "react";
import {IWithClass} from "@types";
import {useGate, useStore} from "effector-react";
import {
    $allManagers,
    $allManagersActions,
    companiesLoading,
    managersActionsGate,
    managersGate
} from "@box/widgets/users/usersRoleList/model";
import {ManagersResultsRow, ManagersRow} from "@box/entities/user";
import classNames from "classnames";
import s from "@box/widgets/companies/companiesVerificationsList/ui/style.module.scss";
import {Table} from "@box/shared/ui";
import {managersResults} from "@box/widgets/companies/companiesVerificationsList/lib";
import {$companies} from "@box/entities/company/model";

export const ManagersResultsList: React.FC<IWithClass> = ({
                                                              className
                                                          }) => {
    const managers = useStore($allManagers);
    const managersActions = useStore($allManagersActions);
    const companies = useStore($companies)
    const loading = useStore(companiesLoading.$loaderStore)

    useGate(managersGate);
    useGate(managersActionsGate);
    const [showActions, setShowActions] = useState<number>(0)
    const filteredManagersActions = (userId: number) => {
        return managersActions.filter(manager => manager.user.id === userId);
    }
    const showActionsHandler = (userId: number) => {
        setShowActions(userId)
        return showActions
    }
    useEffect(() => {
    }, [managers, managersActions, companies]);
    return (
        <div className={className}>
            <Table
                loading={loading}
                empty={managers.length === 0}
                className={classNames("mt-[20px]", s.table, s.table_view)}
                //pagination={<Pagination pagination={pagination}/>}
            >
                <Table.Head
                    headers={managersResults}
                    //ordering={ord.ordering}
                    //onOrderingChange={ord.setOrdering}
                />
                <Table.Body>
                    {
                        managers.map(manager => (
                            <>
                                <ManagersRow
                                    showActions={showActionsHandler}
                                    key={manager.id}
                                    user={manager}
                                    managersActions={filteredManagersActions(manager.id)}/>


                                {showActions === manager.id &&
                                    <ManagersResultsRow
                                        user={manager}
                                        companies={companies}
                                        managersActions={filteredManagersActions(manager.id)}/>
                                }
                            </>
                        ))}
                </Table.Body>
            </Table>
        </div>
    )
}