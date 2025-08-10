import {sample, createEffect} from "effector";
import {AxiosError} from "axios";
import Router from "next/router";
import {
    equiomentApplicationApi,
    applicationLib,
} from "@box/entities/application";
import {notificationModel} from "@box/entities/notification";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@box/types";
import {notVerificatedAlertModel} from "@box/entities/notVerificatedAlert/model";

export const {form: equipmentForm, $totalPrice} =
    applicationLib.createEquipmentForm();

const createEquipmentFx = createEffect<
    Parameters<typeof equiomentApplicationApi.createEquipmentApplication>[0],
    {
        data: Awaited<
            ReturnType<typeof equiomentApplicationApi.createEquipmentApplication>
        >["data"];
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await equiomentApplicationApi.createEquipmentApplication(
            params
        );
        Router.push('/');
        return {
            data,
        };
    },
});

const postEquipmentsImagesFx = createEffect<
    { id: number; images: Array<File | null | string> },
    { image: string } | null,
    AxiosError
>({
    handler: async ({id, images}) => {
        const {data} = await equiomentApplicationApi.setEquipmentApplicationImage(
            images,
            id
        );
        Router.push("/");
        return data;
    },
});

const filtering = () => {
    const authStore = $authStore.getState();
    const filter =
        ((authStore?.user?.role.id as ROLE) === ROLE.MANAGER ||
            (authStore?.user?.role.id as ROLE) === ROLE.COMPANY_ADMIN) &&
        authStore?.user?.company?.status?.label === "Не проверенная";
    return filter;
};

sample({
    // @ts-ignore
    clock: equipmentForm?.formValidated,
    source: {
        values: equipmentForm.$values,
        userRoleId: $authStore.map((el) => el.user?.role.id),
    },
    fn: ({values}) => {
        let normDate;
        if (values.manufactureDate) {
            const date = new Date(values.manufactureDate);
            normDate = new Date(
                date.getTime() - date.getTimezoneOffset() * 60000
            ).toJSON().split('T')[0];
        }
        return {
            deal_type: values.dealType.value,
            count: +values.count,
            was_in_use: Boolean(values.wasInUse.value),
            sale_by_parts: values.saleByParts,
            //ИЗМЕНИЛ
            category: values.category?.value,
            //ДОБАВИЛ
            equipment: values.equipment?.id,
            description: values.description,
            //_____________________________________
            address: values.address,
            longitude: values.longitude,
            latitude: values.latitude,
            with_nds: values.withNds,
            price: +values.priceForUnit,
            comment: values.comment,
            company: values.company?.id,
            city: values.city,
            ...(normDate && {
                manufacture_date: normDate,
            }),
        };
    },
    target: createEquipmentFx,
});

sample({
    clock: createEquipmentFx.doneData,
    source: equipmentForm?.$values,
    fn: (filters, responce) => ({id: responce.data.id, images: filters.images}),
    target: postEquipmentsImagesFx,
});

sample({
    clock: createEquipmentFx.done,
    target: [
        equipmentForm?.reset,
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
    clock: equipmentForm?.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});
