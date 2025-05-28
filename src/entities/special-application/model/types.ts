import {ICompany} from "@box/entities/company/model";

export interface ISpecApplication {
    id: number,
    images: /*Array<File | null | string>,*/Array<{ id: number, image: string }>,
    price: string,
    withNds: boolean,
    address?: string,
    latitude?: number,
    longitude?: number,
    city?: number,
    companies?: Array<ICompany>,
    comment?: string,
    description: string,
    period: number;
    chat: number;
    isDeleted: boolean,
}

export interface ISpecialApplication {
    id: number;
    company: ICompany;
    specialApplication: ISpecApplication;
    paymentNumber: string;
    paymentAccess: boolean;
    timeBegin: Date;
    timeEnd: Date;
}