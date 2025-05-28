import {createEffect, createStore, sample} from 'effector';
import {AxiosError} from 'axios';
import {createGate} from "effector-react";
import {specialApplicationApi} from "@box/entities/special-application/api/SpecialApplicationApi";
import {ISpecialApplication} from "@box/entities/special-application/model/types";
import {equiomentApplicationApi} from "@box/entities/application";
import Router from "next/router";


const specialApplicationsGate = createGate();

const specialApplicationGate = createGate();

const getSpecialApplicationsFx = createEffect<
    Parameters<typeof specialApplicationApi.getSpecialApplications>[0],
    {
        data: Awaited<ReturnType<typeof specialApplicationApi.getSpecialApplications>>["data"];
    }, AxiosError>({
    handler: async (params) => {
        const {data} = await specialApplicationApi.getSpecialApplications(params)
        return {
            data: data
        }
    }
});

const getSpecialApplicationFx = createEffect<
    Parameters<typeof specialApplicationApi.getSpecialApplication>[0],
    /* {
        data: Awaited<ReturnType<typeof specialApplicationApi.getSpecialApplication>>["data"];
    }*/ ISpecialApplication, AxiosError>({
    handler: async (id) => {
        const id_from_url = Router.asPath.split('/')[2]
        const {data} = await specialApplicationApi.getSpecialApplication(+id_from_url/*+auth().user?.company?.id*/)
        return data
    }
});


const updateSpecialApplicationFx = createEffect<
    Parameters<typeof specialApplicationApi.updateSpecialApplication>[0]
    , ISpecialApplication, AxiosError>({
    handler: async (params) => {
        const {data} = await specialApplicationApi.updateSpecialApplication(params);
        return data;
    }
});

const deleteSpecialApplicationFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await equiomentApplicationApi.deleteEquipmentApplication(id);
        return id;
    }
});

const $specialApplications = createStore<Array<ISpecialApplication>>([])
    .on(getSpecialApplicationsFx.doneData, (state, data) => data.data)
    .on(updateSpecialApplicationFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(deleteSpecialApplicationFx.doneData, (state, id) => (
        id !== null ? state.filter((el) => el.id !== id) : state))


const $specialApplication = createStore<ISpecialApplication | null>(null)
    .on(getSpecialApplicationFx.doneData, (state, data) => {
        if (!data.specialApplication.isDeleted)  {
            return data
        }
        return null
    })


sample({
    // @ts-ignore
    clock: [specialApplicationsGate.open],
    target: getSpecialApplicationsFx
})

sample({
    // @ts-ignore
    clock: [specialApplicationGate.open],
    target: getSpecialApplicationFx
})

export {
    getSpecialApplicationFx,
    deleteSpecialApplicationFx,
    updateSpecialApplicationFx,
    $specialApplications,
    $specialApplication,
    specialApplicationsGate,
    specialApplicationGate
};
