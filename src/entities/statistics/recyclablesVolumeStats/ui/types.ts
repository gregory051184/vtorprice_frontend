import {IWithClass} from '@types';

interface IData {
    value: number,
    name: string,
    fill: string,
    id: number,
}

export interface IGraphicsData {
    name: string,
    id: number,
    value: number
}

export interface IRecyclablesCircleGraphicsForMainStatistics extends IWithClass {
    category: (cat: IGraphicsData) => IGraphicsData,
    subCategory: (subCat: IGraphicsData) =>  IGraphicsData,
    //companyType: (companyTypeId:number) =>  number,
    data: IData[]
}

type IPosition = {
    x: string,
    y: string
}

type ISizes = {
    size: IPosition,
//     size1: IPosition,
//     size2: IPosition,
//     size3: IPosition
}

export type IAdaptiveDataForMainStatistics = {
    title: ISizes,
    pie: ISizes
}
