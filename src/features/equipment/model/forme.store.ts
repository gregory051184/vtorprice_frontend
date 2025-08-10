import {createEffect, sample} from "effector";
import {equipmentApi, equipmentCreateFormFunc} from "@box/entities/equipment";
import {AxiosError} from "axios";
import Router from "next/router";
import {$authStore} from "@box/entities/auth";
import {notificationModel} from "@box/entities/notification";
import {notVerificatedAlertModel} from "@box/entities/notVerificatedAlert/model";

export const {form: equipForm} = equipmentCreateFormFunc()
const equipmentCreateFX = createEffect<
    Parameters<typeof equipmentApi.createEquipment>[0],
    {
        data: Awaited<
            ReturnType<typeof equipmentApi.createEquipment>
        >["data"];
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await equipmentApi.createEquipment(
            params
        );
        return {
            data,
        };
    },
});

sample({
    // @ts-ignore
    clock: equipForm?.formValidated,
    source: {values: equipForm.$values},
    fn: ({values}) => {
        return {
            category: values.category?.id,
            name: values.name,
            description: values.description,
        }
    },
    target: equipmentCreateFX
})


sample({
    clock: equipmentCreateFX.done,
    target: [
        equipForm?.reset,
        notificationModel.showAlert.prepend(() => {
            const authStore = $authStore.getState();
            return {
                title: "Успешно",
                message: "Оборудование создано",
            };
        }),
    ],
});

sample({
    clock: equipForm?.formValidated,
    target: notVerificatedAlertModel.openModalNotVerifEvent,
});