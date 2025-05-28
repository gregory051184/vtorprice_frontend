import {sample, createEffect, createEvent, createStore} from 'effector';
import { AxiosError, AxiosResponse } from 'axios';
import { $authStore } from '@box/entities/auth';
import { notVerificatedAlertModel } from '@box/entities/notVerificatedAlert/model';
import {IConfirmationUrl,  subscribeApi, subscribeForm} from "@box/entities/subscribe";
import Router from "next/router";

const createSubscribeEvent= createEvent();

const createSubscribeFx = createEffect<{
    company: number;
    level: number;
    period: number;
}, Awaited<AxiosResponse<IConfirmationUrl>>, AxiosError>({
    handler: async (data) => {
        const response = await subscribeApi.buySubscribe({
            //@ts-ignore
            company_id: data.company,
            level: data.level,
            period: data.period,
            time_begin: new Date(),
        });
        await Router.push(response?.data?.confirmationUrl)
        return response;
    }
});

const $yooKassaUrl = createStore<IConfirmationUrl | null>(null)
    .on(createSubscribeFx.doneData, (_, data) => {
        return data?.data;
    })

sample({
    //@ts-ignore
    clock: subscribeForm?.formValidated,
    source: $authStore,
    fn: (src, clk) => ({
        ...clk,
        userRoleId: src.user?.role.id
    }),
    target: createSubscribeFx
});

/*sample({
    clock: createSubscribeFx.done,
    //filter: () => {return !(filtering());},
    target: [subscribeForm.reset, notificationModel.showAlert.prepend(() => {
        const authStore = $authStore.getState();

        return {
            title: authStore?.proposal-page-companies?.company.status.id === 1
                ? "Рассмотрение покупки отправлено на модерацию"
                : "Успешно",
            message:
                authStore?.proposal-page-companies?.company.status.id === 1
                    ? "Предложение будет создано на сайте после проверки менеджером компании ВторПрайс.\n\nЧтобы публиковать предложения без проверки, верифицируйте Вашу компанию в личном кабинете в разделе “Настройки”."
                    : "Подписка куплена!",
        };
    })],
});!

sample({
    clock: createSubscribeFx.failData,
    target: notificationModel.showAlert.prepend((data) => {
        return({
            title: 'Ошибка',
            // @ts-ignore
            message: data.response.data?.nonFieldErrors[0] || 'Кажется, что-то пошло не так'
        })
    })
});*/

sample({
    clock: subscribeForm?.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});

sample({
    //@ts-ignore
    clock: createSubscribeEvent,
    target: createSubscribeFx
})



export {
    createSubscribeEvent,
    createSubscribeFx
}


