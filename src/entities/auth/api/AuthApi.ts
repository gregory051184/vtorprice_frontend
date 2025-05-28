import {AxiosResponse} from "axios";
import {$authHost, $host} from "@box/shared/api";
import {IAuthUser} from "@box/entities/auth";
import {IUser} from "@box/entities/user";
import {IChecking} from "@box/entities/company/ui/rows/companyRow/types";

type AuthorizeParams = {
    userId: number | string;
    code: string;
};

type MakeCallParams = string;

type UpdateUserParams = Partial<IUser>;

type UpdateRoleParams = {
    idUser: number;
    roleId: number;
};

type IUpdateRole = {
    id: number;
    groups: Array<any>;
    first_name: string;
    last_name: string;
    middle_name: string;
    phone: number;
    position: string;
    role: { id: number; label: string };
    status: { id: number; label: string };
};

export type ISendMessageData = {
    company?: number;
    link?: string;
    companies?: Array<IChecking>;
}

export type UserCreateParams = {
    first_name: string;
    last_name: string;
    middle_name: string;
    company: number;
    phone: string;
    position: string;
}

class AuthApi {
    authorize({userId, code}: AuthorizeParams): Promise<
        AxiosResponse<{
            access: string;
            refresh: string;
            hasCompany: boolean;
        }>
    > {
        return $host.post(`/users/${userId}/phone_confirm/`, {
            code,
        });
    };

    getAuthUser(access_token?: string): Promise<AxiosResponse<IAuthUser>> {
        if (access_token) {
            return $host.get("/users/", {
                headers: {
                    Authorization: `JWT ${access_token}`,
                },
            });
        }
        return $authHost.get("/users/");
    };

    makeCall(phone: MakeCallParams): Promise<
        AxiosResponse<{
            id: number;
            isCreated: boolean;
            phone: string;
        }>
    > {
        return $host.post("/users/make_call/", {
            phone,
        });
    };

    updateUser(data: UpdateUserParams): Promise<AxiosResponse<IAuthUser>> {
        return $authHost.put("/users/", data);
    };

    updateUserWithImages(data: UpdateUserParams): Promise<AxiosResponse<IAuthUser>> {
        const {id, image, ...params} = data;

        return $authHost.put("/users/", {
            ...params,
            ...(image instanceof File && {image})
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    updateUserRole(data: UpdateRoleParams): Promise<AxiosResponse<IUpdateRole>> {
        return $authHost.patch(`/users/update_user_role/${data.idUser}/`, {
            role: data.roleId,
        });
    };

    send_offers_by_email(data: ISendMessageData): Promise<AxiosResponse<ISendMessageData>> {
        return $host.post("/users/send_offers_by_email/", data)

    };

    send_offers_by_whatsapp(data: ISendMessageData): Promise<AxiosResponse<ISendMessageData>> {
        return $host.post("/users/send_offers_by_whatsapp/", data)
    };

    send_offers_by_telegram(data: ISendMessageData): Promise<AxiosResponse<ISendMessageData>> {
        return $host.post("/users/send_offers_by_telegram/", data)
    };

    createNewStaffUser(userCreateParams: UserCreateParams):
        Promise<AxiosResponse<IUser>> {
        return $authHost.post('/users/create_staff_user/', userCreateParams, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    getCompanyStaff(companyId: number): Promise<AxiosResponse<Array<IUser>>> {
        return $authHost.get(`/users/company_staff/`, {params:{id: companyId}})
    }
}

export const authApi = new AuthApi();
