import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError, AxiosResponse} from "axios";
import {$authStore, authApi} from "@box/entities/auth";
import {IUser} from "@box/entities/user";
import {companyStaffCreateForm} from "@box/features/settings/company-staff-management/lib";
import {proposalForm} from "@box/entities/proposal";
import {notificationModel} from '@box/entities/notification';
import {createGate} from "effector-react";
import Router from "next/router";

const createStaffUserEvent = createEvent();

const companyStaffGate = createGate();

const companyStaffOwnerOnlyGate = createGate();

const createNewStaffUserFx = createEffect<{
    first_name: string;
    last_name: string;
    middle_name: string;
    company: number;
    phone: string;
    position: string;
}, Awaited<AxiosResponse<IUser>>, AxiosError>({
    handler: async (data) => {
        const user = $authStore.getState()
        const response = await authApi.createNewStaffUser({
            //@ts-ignore
            company: user.user?.company?.id,
            first_name: data.first_name,
            last_name: data.last_name,
            middle_name: data.middle_name,
            phone: data.phone,
            position: data.position,
        });
        return response;
    }
});

const getCompanyStaffOwnerOnlyFx = createEffect<
    number, Awaited<AxiosResponse<Array<IUser>>>, AxiosError>({
    handler: async () => {
        const user = $authStore.getState()
        //@ts-ignore
        const response = await authApi.getCompanyStaff(+user.user?.company?.id);
        return response;
    }
})

const updateCompanyCurrentStaffFx = createEffect<Array<IUser>, Array<IUser>>({
    handler: (users: Array<IUser>) => {
        return users
    }
})

const updateCompanySuspendStaffFx = createEffect<Array<IUser>, Array<IUser>>({
    handler: (users: Array<IUser>) => {
        return users
    }
})

const $companyCurrentStaffOwnerOnlyFx = createStore<Array<IUser>>([])
    .on(getCompanyStaffOwnerOnlyFx.doneData, (_, data) => data.data)
    //Это подменяет состояние, но на бэкенд оно сохраняется таким же, используется для реального отражения отстранённых сотрудников
    .on(updateCompanyCurrentStaffFx.doneData, (_, data) => data)

const $companySuspendStaffOwnerOnlyFx = createStore<Array<IUser>>([])
    .on(getCompanyStaffOwnerOnlyFx.doneData, (_, data) => data.data)
    //Это подменяет состояние, но на бэкенд оно сохраняется таким же, используется для реального отражения отстранённых сотрудников
    .on(updateCompanySuspendStaffFx.doneData, (_, data) => data)


const getCompanyStaffFx = createEffect<
    number, Awaited<AxiosResponse<Array<IUser>>>, AxiosError>({
    handler: async () => {
        const router = Router.asPath.split('/')[2]
        const response = await authApi.getCompanyStaff(+router)
        return response;
    }
})

const $companyStaff = createStore<Array<IUser>>([])
    .on(getCompanyStaffFx.doneData, (_, data) => data.data)


sample({
    //@ts-ignore
    clock: companyStaffCreateForm?.formValidated,
    source: $authStore,
    fn: (src, clk) => ({
        ...clk,
        userRoleId: src.user?.role.id
    }),
    target: createNewStaffUserFx
});


sample({
    clock: createNewStaffUserFx.done,
    target: [proposalForm?.reset, notificationModel.showAlert.prepend(() => {
        const authStore = $authStore.getState();

        return {
            title: "Успешно",
            message: "Добавлен новый сотрудник",
        };
    })],
});

sample({
    //@ts-ignore
    clock: companyStaffGate.open,
    target: getCompanyStaffFx
})

sample({
    //@ts-ignore
    clock: companyStaffOwnerOnlyGate.open,
    target: getCompanyStaffOwnerOnlyFx
})

export {
    createStaffUserEvent,
    companyStaffGate,
    getCompanyStaffFx,
    $companyStaff,
    companyStaffOwnerOnlyGate,
    getCompanyStaffOwnerOnlyFx,
    //$companyStaffOwnerOnly,
    //updateCompanyStaffFx
    $companyCurrentStaffOwnerOnlyFx,
    $companySuspendStaffOwnerOnlyFx,
    updateCompanySuspendStaffFx,
    updateCompanyCurrentStaffFx
}