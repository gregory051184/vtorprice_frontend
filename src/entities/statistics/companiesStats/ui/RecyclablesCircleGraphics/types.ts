import { IWithClass } from '@types';

export interface IRecyclablesCircleGraphics extends IWithClass {
    suppliers: (string | number)[][],
    processors: (string | number)[][],
    buyers: (string | number)[][]
}

type IPosition = {
    x: string,
    y: string
}

type ISizes = {
    size1: IPosition,
    size2: IPosition,
    size3: IPosition
}

export type IAdaptiveData = {
    title: ISizes,
    pie: ISizes
}
