import {RecyclableColorType} from "@box/widgets/recyclable";
import {IRecyclableApplicationShortForAll} from "@box/entities/application/model";

export interface ICompaniesRecyclableStatisticsSwiper {
    recyclableCategories: () => RecyclableColorType[],
    currentCategory: (categoryId: number) => number,
    currentCompaniesCategory: (companiesCategoryId: number) => number,
    applications:  IRecyclableApplicationShortForAll[],
}