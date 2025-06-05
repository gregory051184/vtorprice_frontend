import {IRecyclableCategory} from "@box/entities/recyclable/model";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";

export type RecyclableColorType = {
    recyclableCategory: IRecyclableCategory,
    totalVolume: VolumesType,
    percents: string,
}

export interface IUniversal {
    name: string,
    id: number,
    value: number
}

export type StockMarketRecyclableTablesType = {
    applications: Array<IRecyclableApplicationShortForAll>;
    recyclableCategories: IRecyclableCategory[];
}

export type VolumesType = {
    totalVolume: number,
    buyVolume: number,
    sellVolume: number,
}