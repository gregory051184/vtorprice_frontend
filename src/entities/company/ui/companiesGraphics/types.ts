import { IWithClass } from '@types';
import {ICompanyShortForAll} from "@box/entities/company/model";

// export interface ICompaniesCircleGraphics extends IWithClass {
//     companies: Array<ICompany>
// }

interface ICompanyWithLastPriceAndVolume {
    company: ICompanyShortForAll,
    lastPrice: number,
    volume: string
}

export interface ICompaniesCircleGraphics extends IWithClass {
    companies: Array<ICompanyWithLastPriceAndVolume>
}