import {ActionsModelsTypes, IManagerActionRow, modelsActions, userActionTypes} from '@box/entities/user';
import {Table} from '@box/shared/ui/table';
import React, {useEffect, useState} from "react";
import s from './styles.module.scss'
import classNames from "classnames";


export const ManagersResultsRow: React.FC<IManagerActionRow> = ({
                                                                    user,
                                                                    managersActions,
    companies
                                                                }) => {
    const [create, setCreate] = useState<number>(0);
    const [update, setUpdate] = useState<number>(0);
    const [del, setDel] = useState<number>(0);

    const stringActionFormater = (companyId: number, str: string) => {

    }

    const mainInfo = () => {
        if (del > 0) {
            if (del === 1) {
                return actionsHandler().supplyContracts.delete.actions
            }
            if (del === 2) {
                return actionsHandler().readyForShipment.delete.actions
            }
            if (del === 3) {
                return actionsHandler().equipmentApplication.delete.actions
            }
            if (del === 4) {
                return actionsHandler().recyclableDeal.delete.actions
            }
            if (del === 5) {
                return actionsHandler().equipmentDeal.delete.actions
            }
        }
        if (update > 0) {
            if (update === 1) {
                return actionsHandler().companyActions.update.actions
            }
            if (update === 2) {
                return actionsHandler().supplyContracts.update.actions
            }
            if (update === 3) {
                return actionsHandler().readyForShipment.update.actions
            }
            if (update === 4) {
                return actionsHandler().equipmentApplication.update.actions
            }
            if (update === 5) {
                return actionsHandler().recyclableDeal.update.actions
            }
            if (update === 6) {
                return actionsHandler().equipmentDeal.update.actions
            }

        }
        if (create > 0) {
            if (create === 1) {
                return actionsHandler().supplyContracts.create.actions
            }
            if (create === 2) {
                return actionsHandler().readyForShipment.create.actions
            }
            if (create === 3) {
                return actionsHandler().equipmentApplication.create.actions
            }
            if (create === 4) {
                return actionsHandler().recyclableDeal.create.actions
            }
            if (create === 5) {
                return actionsHandler().equipmentDeal.create.actions
            }
        }
        return []
    }

    const updateHandler = (num: number) => {
        setDel(0)
        setCreate(0)
        if (update === num) {
            setUpdate(0)

        } else {
            setUpdate(num)
        }
    }

    const deleteHandler = (num: number) => {
        setUpdate(0)
        setCreate(0)
        if (del === num) {
            setDel(0)
        } else {
            setDel(num)
        }
    }

    const createHandler = (num: number) => {
        setUpdate(0)
        setDel(0)
        if (create === num) {
            setCreate(0)
        } else {
            setCreate(num)
        }
    }

    const actionsHandler = (): ActionsModelsTypes => {
        const result: ActionsModelsTypes = {
            companyActions: {
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.COMPANY).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.COMPANY)
                        .map(actions => actions.updatedFields)
                }
            },
            supplyContracts: {
                create: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                delete: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.SUPPLY_CONTRACT_APPLICATION)
                        .map(actions => actions.updatedFields)
                }
            },
            readyForShipment: {
                create: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                delete: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.READY_FOR_SHIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                }
            },
            equipmentApplication: {
                create: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                },
                delete: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.EQUIPMENT_APPLICATION)
                        .map(actions => actions.updatedFields)
                }
            },
            recyclableDeal: {
                create: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL)
                        .map(actions => actions.updatedFields)
                },
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL)
                        .map(actions => actions.updatedFields)
                },
                delete: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.RECYCLABLES_DEAL)
                        .map(actions => actions.updatedFields)
                }
            },
            equipmentDeal: {
                create: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.CREATE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL)
                        .map(actions => actions.updatedFields)
                },
                update: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.UPDATE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL)
                        .map(actions => actions.updatedFields)
                },
                delete: {
                    count: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL).length,
                    actions: managersActions
                        .filter(actions => actions.action.id === userActionTypes.DELETE && actions.actionModel.id === modelsActions.EQUIPMENT_DEAL)
                        .map(actions => actions.updatedFields)
                }
            },
        }
        return result
    }

    useEffect(() => {
    }, [create, update, del]);

    return (
        <div className="inline-flex">
            <div className="w-[240px]">
                <div className="w-full">
                    <h3>
                        Создание
                    </h3>
                    <div
                        onClick={() => actionsHandler().supplyContracts.create.actions.length > 0 && createHandler(1)}
                        className={create === 1 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Контракты на поставку через "Создать заявку" - ${actionsHandler().supplyContracts.create.actions
                                .filter(actions => actions.length === 0).length}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().readyForShipment.create.actions.length > 0 && createHandler(2)}
                        className={create === 2 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`"Готов к отгрузке" - ${actionsHandler().readyForShipment.create.actions
                                .filter(actions => actions.length === 0).length}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().equipmentApplication.create.actions.length > 0 && createHandler(3)}
                        className={create === 3 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Заявка по оборудованию - ${actionsHandler().equipmentApplication.create.actions
                                .filter(actions => actions.length === 0).length}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().recyclableDeal.create.actions.length > 0 && createHandler(4)}
                        className={create === 4 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по сырью - ${actionsHandler().recyclableDeal.create.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().equipmentDeal.create.actions.length > 0 && createHandler(5)}
                        className={create === 5 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по оборудованию - ${actionsHandler().equipmentDeal.create.count}`}
                        </p>
                    </div>
                </div>
                <div className="w-full mt-2">
                    <h3>
                        Изменение
                    </h3>
                    <div
                        onClick={() => actionsHandler().companyActions.update.actions.length > 0 && updateHandler(1)}
                        className={update === 1 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Компании - ${actionsHandler().companyActions.update.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().supplyContracts.update.actions.length > 0 && updateHandler(2)}
                        className={update === 2 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`"Контракты на поставку" через карточку компании - ${actionsHandler().supplyContracts.update.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().readyForShipment.update.actions.length > 0 && updateHandler(3)}
                        className={update === 3 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Готов к отгрузке - ${actionsHandler().readyForShipment.update.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().equipmentApplication.update.actions.length > 0 && updateHandler(4)}
                        className={update === 4 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Заявки по оборудованию - ${actionsHandler().equipmentApplication.update.count}`}
                        </p>
                    </div>
                    <div onClick={() => actionsHandler().recyclableDeal.update.actions.length > 0 && updateHandler(5)}
                         className={update === 5 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по сырью - ${actionsHandler().recyclableDeal.update.count}`}
                        </p>
                    </div>
                    <div onClick={() => actionsHandler().equipmentDeal.update.actions.length > 0 && updateHandler(6)}
                         className={update === 6 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по оборудованию - ${actionsHandler().equipmentDeal.update.count}`}
                        </p>
                    </div>
                </div>
                <div className="w-full mt-2">
                    <h3>
                        Удаление
                    </h3>
                    <div
                        onClick={() => /*actionsHandler().supplyContracts.delete.actions.length > 0 && */deleteHandler(1)}
                        className={del === 1 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                    <p className={s.result}>
                            {`"Контракты на поставку" через карточку компании - ${actionsHandler().supplyContracts.delete.count}`}
                        </p>
                    </div>

                    <div
                        onClick={() => actionsHandler().readyForShipment.delete.actions.length > 0 && deleteHandler(2)}
                        className={del === 2 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Готов к отгрузке - ${actionsHandler().readyForShipment.delete.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().equipmentApplication.delete.actions.length > 0 && deleteHandler(3)}
                        className={del === 3 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Заявки по оборудованию - ${actionsHandler().equipmentApplication.delete.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().readyForShipment.delete.actions.length > 0 && deleteHandler(4)}
                        className={del === 4 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по сырью - ${actionsHandler().recyclableDeal.delete.count}`}
                        </p>
                    </div>
                    <div
                        onClick={() => actionsHandler().equipmentDeal.delete.actions.length > 0 && deleteHandler(5)}
                        className={del === 5 ? classNames(s.row, "border-[#439E7E] border-[2px]") : s.row}>
                        <p className={s.result}>
                            {`Сделки по оборудованию - ${actionsHandler().equipmentDeal.delete.count}`}
                        </p>
                    </div>
                </div>
            </div>
            {(del > 0 || update > 0 || create > 0) &&
                <div className="w-[340px] min-h-[750px] bg-grey-60 rounded-[10px] mt-11 ml-8">
                    {
                        mainInfo().map(action => (
                            <div>
                                {action.map(item => (
                                    <p>
                                        {`Компании - ${item}`}
                                    </p>
                                ))}
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}