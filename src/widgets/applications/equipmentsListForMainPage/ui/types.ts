import {IWithClass} from "@types";
import {IEquipmentApplication} from "@box/entities/application/model";
import {ReactNode} from "react";

export interface IEquipCard extends IWithClass {
    equipment: IEquipmentApplication,
    deleteButton?: ReactNode
}
