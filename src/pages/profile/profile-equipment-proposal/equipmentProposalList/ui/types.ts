import { IWithClass } from '@types';
import {IChecking} from "@box/entities/company/ui/rows/companyRow/types";


export interface IEquipmentProposalListForSending extends IWithClass {
    checking?: Array<IChecking>;
    onChange?: (selected: any) => void;
}
