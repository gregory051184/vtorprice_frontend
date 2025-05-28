import {sample, createEffect, createEvent} from 'effector';
import { AxiosError, AxiosResponse } from 'axios';
import { notificationModel } from '@box/entities/notification';
import { $authStore } from '@box/entities/auth';
import { ROLE } from '@box/types';
import { notVerificatedAlertModel } from '@box/entities/notVerificatedAlert/model';
import {proposalForm, IProposal, proposalApi} from "@box/entities/proposal";


const createProposalEvent= createEvent()

const createRandomString = () => {
    const some_str = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ123456789"
    let random = some_str[Math.floor(Math.random() * some_str.length)];
    let newAbc = "";
    while (newAbc.length < 30) {
        newAbc += random;
        random = some_str[Math.floor(Math.random() * some_str.length)];
    }
    return newAbc;
}


const createProposalFx = createEffect<{
    sender_company: number;
    special_id: string;
    companies: Array<number>
    applications: Array<number>
}, Awaited<AxiosResponse<IProposal>>, AxiosError>({
    handler: async (data) => {
        const user = $authStore.getState()
        const response = await proposalApi.createProposal({
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
    clock: proposalForm?.formValidated,
    source: $authStore,
    fn: (src, clk) => ({
        ...clk,
        userRoleId: src.user?.role.id
    }),
    target: createProposalFx
});



sample({
    clock: createProposalFx.done,
    target: [proposalForm?.reset, notificationModel.showAlert.prepend(() => {
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
    clock: createProposalFx.failData,
    target: notificationModel.showAlert.prepend((data) => {
        return({
            title: 'Ошибка',
            // @ts-ignore
            message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
        })
    })
});

sample({
    clock: proposalForm?.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});

export {
    createProposalEvent
}


