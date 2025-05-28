import {ISelectValue} from "@box/shared/ui";
import {IDistrict} from "@box/entities/district";
import {districtApi} from "@box/entities/district/api/districtApi";

export const districtSelectApi = async (
    search: string
): Promise<Array<ISelectValue<IDistrict>>> => {
    try {
        const { data } = await districtApi.getDistricts({
            search,
        });
        return data.results.map((el) => ({
            id: el.id,
            label: el.name,
            value: el,
        }));
    } catch {
        return [];
    }
};