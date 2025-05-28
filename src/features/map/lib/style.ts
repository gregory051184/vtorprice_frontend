import {IEquipmentApplication, IRecyclableApplication} from "@box/entities/application/model";

export type ApplicationRowInfoType = {
    application:  IRecyclableApplication | IEquipmentApplication;
    onClickOnItem: (isEquipment:boolean, id: number) => void
}