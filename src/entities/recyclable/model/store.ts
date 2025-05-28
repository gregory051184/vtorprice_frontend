import {createEffect, createStore, sample} from 'effector';
import {AxiosError} from 'axios';
import {recyclableApi} from '@box/entities/recyclable/api';
import {IRecyclable} from './types';
import {createGate} from "effector-react";

const recyclableGate = createGate();
const recGate = createGate();

const getRecyclableFx = createEffect<
    Parameters<typeof recyclableApi.getRecyclable>[0],
    IRecyclable,
    AxiosError>({
    handler: async (id) => {
        const {data} = await recyclableApi.getRecyclable(id);
        return data;
    }
});

const getRecyclablesByCategoryIdFx = createEffect<
    Parameters<typeof recyclableApi.getRecyclablesByCategoryId>[0],
    {
        data: Awaited<ReturnType<typeof recyclableApi.getRecyclablesByCategoryId>>["data"];
    },
    AxiosError>({
    handler: async (id) => {
        const {data} = await recyclableApi.getRecyclablesByCategoryId(id)
        return {
            data
        }
    }
})

const $recyclable = createStore<IRecyclable | null>(null)
    .on(getRecyclableFx.doneData, (_, data) => data);

const $recyclables = createStore<Array<IRecyclable>>([])
    .on(getRecyclablesByCategoryIdFx.doneData, (state, data) =>
        data.data/*.results*/
    )

sample({
    //@ts-ignore
    clock: recyclableGate.open,
    target: getRecyclablesByCategoryIdFx
})

sample({
    //@ts-ignore
    clock: recGate.open,
    target: getRecyclableFx
})

export {
    $recyclables,
    $recyclable,
    getRecyclableFx,
    getRecyclablesByCategoryIdFx,
    recyclableGate,
    recGate,
};
