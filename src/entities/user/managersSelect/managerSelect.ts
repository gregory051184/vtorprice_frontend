import {ISelectValue} from "@box/shared/ui";
import {authApi} from "@box/entities/auth";
import {IUser} from "@box/entities/user";
import {userAgent} from "next/server";
import {ROLE} from "@types";


export const managerSelectApi = async (
): Promise<Array<ISelectValue<IUser>>> => {
    try {
        const { data } = await authApi.getOnlyManagers({size: 1000});
        return data.map((el) => ({
            id: el.id,
            label: `${el.lastName} ${el.firstName}`,
            value: el,
        }));
    } catch {
        return [];
    }
};

// export const managerSelectApi = async (): Promise<Array<ISelectValue<IManager>>> => {
//     try {
//         const {data} = await authApi.getOnlyManagers();
//         return data
//             .filter(user => user.user.role.id === ROLE.MANAGER)
//             .map((el) => ({
//                 id: el.user.id,
//                 label: `${el.user.lastName} ${el.user.firstName}`,
//                 value: el.user,
//             }));
//     } catch {
//         return [];
//     }
// };