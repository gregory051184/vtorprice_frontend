import {AxiosResponse} from "axios";
import {IEquipment} from "@box/entities/application/model";
import {$authHost} from "@box/shared/api";

type CreateEquipmentParams = {
    category: number,
    name: string,
    description: string
}

class EquipmentApi {
    createEquipment(data: CreateEquipmentParams):
        Promise<AxiosResponse<IEquipment>> {
        return $authHost.post('/equipment_categories/equipment/', data)
    }
}

export const equipmentApi = new EquipmentApi();