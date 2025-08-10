import {equiomentApplicationApi} from '@box/entities/application';
import {ISelectValue} from "@box/shared/ui";

import {IEquipment, IEquipmentCategory} from "@box/entities/application/model";

export const equipmentSelectApi = async () => {
    const {data} = await equiomentApplicationApi.getEquipmentCategory();
    return data.results.map((category) => ({
        id: category.id,
        label: category.name,
        value: category.id
    }))
};


export const equipmentCategorySelectAPi = async ():
    Promise<Array<ISelectValue<IEquipmentCategory>>> => {
    try {
        const {data} = await equiomentApplicationApi.getEquipmentCategory();
        return data.results.map((el) => ({
            id: el.id,
            label: el.name,
            value: el
        }))

    } catch {
        return [];
    }
};

export const equipmentApi = async () => {
    const {data} = await equiomentApplicationApi.getEquipmentCategory();
    const allEquipments: Array<IEquipment> = [];
    data.results.forEach((catagory) => {
        const {equipments} = catagory;
        equipments.forEach((equipments) => {
            allEquipments.push(equipments);
        });
    });
    return allEquipments.map((category) => ({
        id: category.id,
        label: category.name,
        value: category.id
    }));
};
