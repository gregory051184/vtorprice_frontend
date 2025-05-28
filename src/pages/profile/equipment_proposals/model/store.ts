import {createEffect, createStore, sample} from 'effector';
import {AxiosError} from 'axios';
import {createGate} from "effector-react";
import Router from 'next/router';
import {equipmentProposalApi, IEquipmentProposal} from "@box/entities/equipment_proposal";


const gate = createGate();

const equipmentProposalGate = createGate();

const equipmentProposalForCompaniesGate = createGate();

const getEquipmentProposalsFx = createEffect<
    Parameters<typeof equipmentProposalApi.getEquipmentProposals>[0],
    {
        data: Awaited<ReturnType<typeof equipmentProposalApi.getEquipmentProposals>>["data"];
    }, AxiosError>({
    handler: async (params) => {
        const {data} = await equipmentProposalApi.getEquipmentProposals(params)
        return {
            data: data
        }
    }
});

const getEquipmentProposalFx = createEffect<
    Parameters<typeof equipmentProposalApi.getEquipmentProposal>[0],
    {
        data: Awaited<ReturnType<typeof equipmentProposalApi.getEquipmentProposal>>["data"];
    }, AxiosError>({
    handler: async (id) => {
        const {data} = await equipmentProposalApi.getEquipmentProposal(id)
        return {
            data: data
        }
    }
});

const getEquipmentProposalForCompaniesFx = createEffect<
    Parameters<typeof equipmentProposalApi.getEquipmentProposalForCompanies>[0],
    {
        data: Awaited<ReturnType<typeof equipmentProposalApi.getEquipmentProposalForCompanies>>["data"];
    }, AxiosError>({
    // Приходит id с серверной части фронтенда, но не передаётся клиенту, а передаётся пустой объект
    // Передаю id через Router
    handler: async () => {
        const special_id = Router.asPath.split('/')[3]
        const {data} = await equipmentProposalApi.getEquipmentProposalForCompanies(special_id)
        return {
            data: data
        }
    }
});

const deleteEquipmentProposalFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await equipmentProposalApi.deleteEquipmentProposal(id);
        return id;
    },
});

const updateEquipmentProposalFx = createEffect<
    Parameters<typeof equipmentProposalApi.updateEquipmentProposal>[0],
    IEquipmentProposal,
    AxiosError>({
    handler: async (params) => {
        const {data} = await equipmentProposalApi.updateEquipmentProposal(params);
        return data;
    },
});

const $equipmentProposalForCompanies = createStore<IEquipmentProposal | null>(null)
    .on(getEquipmentProposalForCompaniesFx.doneData, (_, data) => data.data)

const $equipmentProposals = createStore<Array<IEquipmentProposal>>([])
    .on(getEquipmentProposalsFx.doneData, (state, data) => data.data.results)
    .on(deleteEquipmentProposalFx.doneData, (store, id) =>
        id !== null ? store.filter((el) => el.id !== id) : store)
    .on(updateEquipmentProposalFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex(
            (el) => el.id === data.id
        );
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })

const $equipmentProposal = createStore<IEquipmentProposal | null>(null)
    .on(getEquipmentProposalFx.doneData, (_, data) => data.data)
    .on(updateEquipmentProposalFx.doneData, (_, data) => data)


sample({
    // @ts-ignore
    clock: [gate.open],
    target: getEquipmentProposalsFx
})

sample({
    // @ts-ignore
    clock: [equipmentProposalGate.open],
    target: getEquipmentProposalFx
})

sample({
    // @ts-ignore
    clock: [equipmentProposalForCompaniesGate.open],
    target: getEquipmentProposalForCompaniesFx
})

export {
    $equipmentProposal,
    $equipmentProposals,
    $equipmentProposalForCompanies,
    getEquipmentProposalsFx,
    getEquipmentProposalFx,
    deleteEquipmentProposalFx,
    equipmentProposalGate,
    gate,
    updateEquipmentProposalFx,
    getEquipmentProposalForCompaniesFx,
    equipmentProposalForCompaniesGate,
};
