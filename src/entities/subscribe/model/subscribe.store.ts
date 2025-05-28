import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from 'axios';
import {createGate} from "effector-react";
import {subscribeApi} from "@box/entities/subscribe/api/SubscribeApi";
import {ISubscribe, ISubscribeCategory} from "@box/entities/subscribe";
import {$authStore} from "@box/entities/auth";
import {notificationModel} from '@box/entities/notification';

const gate = createGate();

const subscribeGate = createGate();

const subscribeEvent = createEvent<Parameters<typeof subscribeApi.updateSubscribe>[0]>();

//Этот эффект получает из БД все категории подписок
const getSubscribeCategoriesFx = createEffect<
    Parameters<typeof subscribeApi.getSubscribeCategories>[0],
    {
        data: Awaited<ReturnType<typeof subscribeApi.getSubscribeCategories>>["data"];
    }, AxiosError>({
    handler: async (params) => {
        const {data} = await subscribeApi.getSubscribeCategories(params)
        return {
            data: data
        }
    }
});

const getSubscribesFx = createEffect<
    Parameters<typeof subscribeApi.getSubscribes>[0],
    {
        data: Awaited<ReturnType<typeof subscribeApi.getSubscribes>>["data"];
    }, AxiosError>({
    handler: async (params) => {
        const {data} = await subscribeApi.getSubscribes(params)
        return {
            data: data
        }
    }
});


const getSubscribeFx = createEffect<
    Parameters<typeof subscribeApi.getSubscribe>[0],
    {
        data: Awaited<ReturnType<typeof subscribeApi.getSubscribe>>["data"];
    }, AxiosError>({
    handler: async () => {
        const auth = () => $authStore.getState();
        //@ts-ignore
            const {data} = await subscribeApi.getSubscribe(+auth().user?.company?.id)
            return {
                data: data
            }
        }
});

const updateSubscribeFx = createEffect<
    Parameters<typeof subscribeApi.updateSubscribe>[0],
    ISubscribe,
    AxiosError
>({
    handler: async (params) => {
        const {data} = await subscribeApi.updateSubscribe(params);
        return data;
    },
});

/*const deleteProposalFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await proposalApi.deleteProposal(id);
        return id;
    },
});*/

const $subscribesCategories = createStore<Array<ISubscribeCategory>>([])
    .on(getSubscribeCategoriesFx.doneData, (state, data) => data.data);

const $subscribes = createStore<Array<ISubscribe | null>>([])
    .on(getSubscribesFx.doneData, (_, data) => data.data);

const $subscribe = createStore<ISubscribe | null>(null)
    .on(getSubscribeFx.doneData, (_, data) => data.data)
    .on(updateSubscribeFx.doneData, (_, data) => data)


/*sample({
    //??????????????????????????????
    // @ts-ignore
    source: $proposals,
    filter: (source) => source !== null,
    target: getProposalsFx
});*/

sample({
    // @ts-ignore
    clock: [gate.open],
    target: getSubscribeCategoriesFx
})

sample({
    // @ts-ignore
    clock: [subscribeGate.open],
    target: getSubscribeFx
})

sample({
    clock: subscribeEvent,
    target: updateSubscribeFx
});

sample({
    clock: updateSubscribeFx.doneData,
    target: notificationModel.showAlert.prepend(() => ({
        title: 'Подписка закончилась!',
        message: 'Вы можете обновить подписку'
    }))
});



export {
    $subscribesCategories,
    $subscribe,
    getSubscribeFx,
    getSubscribesFx,
    getSubscribeCategoriesFx,
    subscribeGate,
    gate,
    subscribeEvent,
};
