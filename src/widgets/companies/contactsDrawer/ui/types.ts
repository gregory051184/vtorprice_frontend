import { ICompany } from '@box/entities/company/model';
import { IDrawer } from '@box/shared/ui/drawer/types';
import {IUser} from "@box/entities/user";

export interface IContactsDrawer extends IDrawer {
    company: ICompany
    users: Array<IUser>
}
