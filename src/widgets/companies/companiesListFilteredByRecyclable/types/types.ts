import {IWithClass} from "@types";
import {ICompanyWithLastPriceAndVolumeRow} from "@box/entities/company/ui/rows/companyFilteredByRecyclableRow/types";


export interface ICompanyFilteredByRecyclableTable extends IWithClass{
    companies: ICompanyWithLastPriceAndVolumeRow[];

}