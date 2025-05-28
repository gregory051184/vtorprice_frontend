import {ICompany} from "@box/entities/company/model";

export interface ISubscribe {
    id: number;
    company: ICompany;
    is_deleted: boolean;
    isDeleted?: boolean;
    subscribe: ISubscribeCategory;
    paymentNumber: string;
    paymentAccess: boolean;
    timeBegin: Date;
    timeEnd: Date;
}

export interface ISubscribeCategory {
    id: number
    name: string;
    price: number;
    description: string;
    level: { id: number; label: string };
    period: { id: number; label: string };
    counter: number;
    staffCount: number;
    isDeleted: boolean;
    createdAt: Date;
}