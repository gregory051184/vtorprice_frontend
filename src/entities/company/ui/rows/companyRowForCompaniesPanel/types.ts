import {IRecyclableCategory} from "@box/entities/recyclable/model";
import {IRecyclableApplicationPrice} from "@box/entities/statistics/recyclablesApplicationsPrices/model";


export type CompanyRowForCompaniesPanelType = {
    recyclableCategory: IRecyclableCategory;
    recyclables:  IRecyclableApplicationPrice[];
}