import {sample, createEffect, createEvent} from 'effector';
import {AxiosError, AxiosResponse} from 'axios';
import {$authStore} from '@box/entities/auth';
import {notVerificatedAlertModel} from '@box/entities/notVerificatedAlert/model';
import { notificationModel } from "@box/entities/notification";
import {
    createSpecialApplicationForm,
    specialApplicationApi,
} from "@box/entities/special-application";
import {ITabSelectValue} from "@box/shared/ui";
import Router from "next/router";
import {IConfirmationUrl} from "@box/entities/subscribe";


export const {
    form: specialApplicationForm,
} = createSpecialApplicationForm();



const createSpecialApplicationEvent = createEvent();

const createSpecialApplicationFx = createEffect<{
    //images: Array<File | null | string>,
    price: string,
    withNds: boolean,
    address: string,
    latitude: number,
    longitude: number,
    city: number,
    company?: ITabSelectValue<number>,
    //comment: string,
    description: string,
    period: ITabSelectValue<number>;
}, Awaited<AxiosResponse<IConfirmationUrl>>, AxiosError>({
    handler: async (data) => {
        const response = await specialApplicationApi.createSpecialApplication({
            //@ts-ignore
            company_id: data.company?.id,
            //images: data.images.filter((val) => val !== null) as Array<File | string>,
            period: +data.period?.id,
            price: +data.price,
            withNds: data.withNds,
            //comment: data.comment,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            description: data.description,
            city: data.city,
            time_begin: new Date(),
        });
        await Router.push(response?.data?.confirmationUrl)
        return response;
    }
});


const postSpecialApplicationImagesFx = createEffect<
    { id: number; images: Array<File | null | string> },
    { image: string } | null,
    AxiosError
>({
    handler: async ({ id, images }) => {
        const { data } = await specialApplicationApi.setSpecialApplicationImage(
            images,
            id
        );
        //Router.push("/");
        return data;
    },
});

sample({
    //@ts-ignore
    clock: createSpecialApplicationFx.doneData,
    //filter: () => {return !filtering();},
    source: specialApplicationForm?.$values,
    fn: (filters, responce) => ({ id: responce.data.id, images: filters.images }),
    target: postSpecialApplicationImagesFx,
});

sample({
    clock: postSpecialApplicationImagesFx.doneData,
    //filter: () => {return !filtering();},
    target: [
        specialApplicationForm?.reset,
        notificationModel.showAlert.prepend(() => {
            const authStore = $authStore.getState();
            return {
                title: authStore?.user?.company.status.id === 1
                    ? "Заявка отправлена на модерацию"
                    : "Успешно",
                message:
                    authStore?.user?.company.status.id === 1
                        ? "Заявка будет опубликована на сайте после проверки менеджером компании Вторпрайс.\n\nЧтобы публиковать заявки без проверки,  верифицируйте Вашу компанию в личном кабинете в разделе “Настройки”."
                        : "Заявка опубликована",
            };
        }),
    ],
});

sample({
    clock: specialApplicationForm?.formValidated,
    //filter: () => {return filtering();},
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});



sample({
    //@ts-ignore
    clock: specialApplicationForm.formValidated,
    source: $authStore,
    fn: (src, clk) => ({
        ...clk,
        userRoleId: src.user?.role.id
    }),
    target: createSpecialApplicationFx
});

sample({
    clock: specialApplicationForm.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});

sample({
    //@ts-ignore
    clock: createSpecialApplicationEvent,
    target: createSpecialApplicationFx
})


export {
    postSpecialApplicationImagesFx,
    createSpecialApplicationEvent,
    createSpecialApplicationFx,
}


