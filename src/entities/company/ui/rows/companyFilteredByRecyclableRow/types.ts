import {ICompanyShortForAll} from "@box/entities/company/model";
import {IWithClass} from "@types";


export interface ICompanyWithLastPriceAndVolumeRow extends IWithClass{
    company: ICompanyShortForAll,
    lastPrice: number,
    volume: string
}
