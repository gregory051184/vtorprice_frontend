import { IWithClass } from '@types';
import {IEquipmentApplication} from '../../../model';
import {IChecking} from "@box/entities/company/ui/rows/companyRow/types";

export interface IEquipmentApplicationCardForEquipmentProposal extends IWithClass {
    application: IEquipmentApplication;
    checking?: Array<IChecking>;
    onChange?: (selected: any) => void;
}