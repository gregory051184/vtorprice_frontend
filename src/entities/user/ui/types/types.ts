import {IStatus} from "@box/entities/logistics/model";
import {IUser} from "@box/entities/user";
import {ICompany} from "@box/entities/company/model";


export interface IManager {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    position: string;
    role: IStatus
}


export interface IManagersActions {
    id: number;
    isDeleted: boolean;
    user: IManager;
    createdAt: Date;
    action: IStatus;
    actionModel: IStatus;
    modelId: number;
    updatedFields: string[];
}


export interface IManagerRow {
    user: IUser;
    managersActions: IManagersActions[];
    showActions: (userId:number) => number;
}

export interface IManagerActionRow {
    user: IUser;
    companies: ICompany[];
    managersActions: IManagersActions[];
}


export type MainActionsTypes = {
    create: {
        count: number
        actions: string[][]
    }
    update: {
        count: number
        actions: string[][]
    }
    delete: {
        count: number
        actions: string[][]
    }
}

export interface ActionsModelsTypes {
    companyActions: {
        update: {
            count: number
            actions: string[][]
        }
    };
    supplyContracts: MainActionsTypes;
    readyForShipment: MainActionsTypes;
    equipmentApplication: MainActionsTypes;
    recyclableDeal: MainActionsTypes;
    equipmentDeal: MainActionsTypes;
}

