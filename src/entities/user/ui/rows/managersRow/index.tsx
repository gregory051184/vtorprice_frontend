import {Button, Table} from "@box/shared/ui";
import React, {useEffect, useState} from "react";
import {ActionsModelsTypes, IManagerRow, modelsActions, userActionTypes} from "@box/entities/user";
import InfoIcon from "@assets/icons/16_info.svg";


export const ManagersRow: React.FC<IManagerRow> = ({
                                                       user,
                                                       managersActions,
                                                       showActions
                                                   }) => {
    const [actionsCount, setActionsCount] = useState<number>(0);
    const [show, setActions] = useState<number>(0)
    const showActionsHandler = (userId: number) => {
        if (show === 0) {
            showActions(userId);
            setActions(userId);
        }
        if (show === userId) {
            showActions(0);
            setActions(0);
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
        const count = result.companyActions.update.count
            + result.supplyContracts.create.count
            + result.supplyContracts.update.count
            + result.supplyContracts.delete.count
            + result.readyForShipment.create.count
            + result.readyForShipment.update.count
            + result.readyForShipment.delete.count
            + result.equipmentApplication.create.count
            + result.equipmentApplication.update.count
            + result.equipmentApplication.delete.count
            + result.recyclableDeal.create.count
            + result.recyclableDeal.update.count
            + result.recyclableDeal.delete.count
            + result.equipmentDeal.create.count
            + result.equipmentDeal.update.count
            + result.equipmentDeal.delete.count
        setActionsCount(count)
        return result
    }


    useEffect(() => {
        console.log(actionsHandler())
    }, [managersActions, actionsCount, show]);

    return (
        <Table.Row
            className="border"
        >
            <Table.Cell>
                <div className="inline-flex">
                    <Button
                        type="micro"
                        mode="fill"
                        onClick={() => showActionsHandler(user.id)}>
                        <InfoIcon/>
                    </Button>
                    <p className="ml-5">
                        {`${user?.lastName} ${user?.firstName}`}
                    </p>
                </div>
            </Table.Cell>
            <Table.Cell>
                <p>
                    {`${user?.position}`}
                </p>
            </Table.Cell>
            {/*<Table.Cell>*/}
            {/*    <p>{`${actionsCount}`}</p>*/}
            {/*</Table.Cell>*/}
            <Table.Cell>
                <p>
                    {`${user.lastName} ${user.firstName}`}
                </p>
            </Table.Cell>
        </Table.Row>
    )
}