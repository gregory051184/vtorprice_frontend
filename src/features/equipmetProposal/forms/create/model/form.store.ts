import {sample, createEffect, createEvent} from 'effector';
import { AxiosError, AxiosResponse } from 'axios';

import { notificationModel } from '@box/entities/notification';
import { $authStore } from '@box/entities/auth';
import { ROLE } from '@box/types';
import { notVerificatedAlertModel } from '@box/entities/notVerificatedAlert/model';
import {equipmentProposalApi, IEquipmentProposal} from "@box/entities/equipment_proposal";


import {createForm} from "@box/shared/effector-forms";


export const equipmentsProposalForm = createForm({
    fields: {
        sender_company: {
            init: 0
        },

        companies: {
            init: Array<number>,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: Array<number>) => val.length > 0
                }
            ]
        },

        applications: {
            init: Array<number>,
            rules: [
                {
                    name: 'not_null',
                    validator: (val: Array<number>) => val.length > 0
                }
            ]
        }
    },
    validateOn: ['change', 'submit'],
});


const createEquipmentProposalEvent = createEvent()


const createRandomString = () => {
    //const abc = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ%?!";
    const some_str = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ123456789"
    let random = some_str[Math.floor(Math.random() * some_str.length)];
    let newAbc = "";
    while (newAbc.length < 30) {
        newAbc += random;
        random = some_str[Math.floor(Math.random() * some_str.length)];
    }
    return newAbc;
}


const createEquipmentProposalFx = createEffect<{
    sender_company: number;
    special_id: string;
    companies: Array<number>
    applications: Array<number>
}, Awaited<AxiosResponse<IEquipmentProposal>>, AxiosError>({
    handler: async (data) => {
        const user = $authStore.getState()
        const response = await equipmentProposalApi.createEquipmentProposal({
            //@ts-ignore
            sender_company: user.user?.company.id,
            special_id: createRandomString(),
            companies: data.companies,
            applications: data.applications
        });
        return response;
    }
});



const filtering = () => {
    const authStore = $authStore.getState();
    const filter = (authStore?.user?.role.id as ROLE === ROLE.MANAGER ||
            authStore?.user?.role.id as ROLE === ROLE.COMPANY_ADMIN) &&
        authStore?.user?.company?.status?.label === "Не проверенная"
    return filter;
}

sample({
    //@ts-ignore
    clock: equipmentsProposalForm?.formValidated,
    source: $authStore,
    fn: (src, clk) => ({
        ...clk,
        userRoleId: src.user?.role.id
    }),
    target: createEquipmentProposalFx
});



sample({
    clock: createEquipmentProposalFx.done,
    target: [equipmentsProposalForm?.reset, notificationModel.showAlert.prepend(() => {
        const authStore = $authStore.getState();

        return {
            title: authStore?.user?.company.status.id === 1
                ? "Предложение отправлено на модерацию"
                : "Успешно",
            message:
                authStore?.user?.company.status.id === 1
                    ? "Предложение будет создано на сайте после проверки менеджером компании ВторПрайс.\n\nЧтобы публиковать предложения без проверки, верифицируйте Вашу компанию в личном кабинете в разделе “Настройки”."
                    : "Предложение создано",
        };
    })],
});

sample({
    clock: createEquipmentProposalFx.failData,
    target: notificationModel.showAlert.prepend((data) => {
        return({
            title: 'Ошибка',
            // @ts-ignore
            message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
        })
    })
});

sample({
    clock: equipmentsProposalForm?.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});

export {
    createEquipmentProposalEvent
}


