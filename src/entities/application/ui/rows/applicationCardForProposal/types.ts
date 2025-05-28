import { IWithClass } from '@types';
import { IRecyclableApplication } from '../../../model';
import {IChecking} from "@box/entities/company/ui/rows/companyRow/types";

export interface IApplicationCardForProposal extends IWithClass {
    application: IRecyclableApplication,
    checking?: Array<IChecking>;
    onChange?: (selected: any) => void;
}