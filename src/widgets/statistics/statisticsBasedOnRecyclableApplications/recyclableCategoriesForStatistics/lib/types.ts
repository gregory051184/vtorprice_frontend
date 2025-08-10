import {ICompanyShortForAll} from "@box/entities/company/model";
import {IRecyclableCategory, IRecyclableShortForAll} from "@box/entities/recyclable/model";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";

export type CompaniesWithFractionsType = {
    company: ICompanyShortForAll,
    fractions: IRecyclableShortForAll[]
    applications: IRecyclableApplicationShortForAll[]
}

export type RecyclableColorType = {
    recyclableCategory: IRecyclableCategory,
    totalVolume: VolumesType,
    percents: string,
}

export type RecyclableCategoriesForStatisticsType = {
    categories: IRecyclableCategory[],
}

export type VolumesType = {
    totalVolume: number,
    buyVolume: number,
    sellVolume: number,
}