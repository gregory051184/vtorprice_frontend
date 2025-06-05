import {ISelectValue} from "@box/shared/ui";
import {authApi} from "@box/entities/auth";
import {IUser} from "@box/entities/user";


export const managerSelectApi = async (
): Promise<Array<ISelectValue<IUser>>> => {
    try {
        const { data } = await authApi.getOnlyManagers();
        return data.map((el) => ({
            id: el.id,
            label: `${el.lastName} ${el.firstName} ${el.lastName}`,
            value: el,
        }));
    } catch {
        return [];
    }
};