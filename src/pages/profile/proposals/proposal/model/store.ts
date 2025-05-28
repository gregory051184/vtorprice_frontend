import {createEffect, createStore, sample} from 'effector';
import {AxiosError} from 'axios';
import {IProposal, proposalApi} from "@box/entities/proposal";
import {createGate} from "effector-react";
import Router from 'next/router';


const gate = createGate();

const proposalGate = createGate();

const proposalForCompaniesGate = createGate();

const getProposalsFx = createEffect<
    Parameters<typeof proposalApi.getProposals>[0],
    {
        data: Awaited<ReturnType<typeof proposalApi.getProposals>>["data"];
    }, AxiosError>({
    handler: async (params) => {
        const {data} = await proposalApi.getProposals(params)
        return {
            data: data
        }
    }
});

const getProposalFx = createEffect<
    Parameters<typeof proposalApi.getProposal>[0],
    {
        data: Awaited<ReturnType<typeof proposalApi.getProposal>>["data"];
    }, AxiosError>({
    handler: async (id) => {
        const {data} = await proposalApi.getProposal(id)
        return {
            data: data
        }
    }
});

const getProposalForCompaniesFx = createEffect<
    Parameters<typeof proposalApi.getProposalForCompanies>[0],
    {
        data: Awaited<ReturnType<typeof proposalApi.getProposalForCompanies>>["data"];
    }, AxiosError>({
    // Приходит id с серверной части фронтенда, но не передаётся клиенту, а передаётся пустой объект
    // Передаю id через Router
    handler: async () => {
        const special_id = Router.asPath.split('/')[3]
        const {data} = await proposalApi.getProposalForCompanies(special_id)
        return {
            data: data
        }
    }
});

const deleteProposalFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await proposalApi.deleteProposal(id);
        return id;
    },
});

const updateProposalFx = createEffect<
    Parameters<typeof proposalApi.updateProposal>[0],
    IProposal,
    AxiosError>({
    handler: async (params) => {
        const {data} = await proposalApi.updateProposal(params);
        return data;
    },
});

const $proposals = createStore<Array<IProposal>>([])
    .on(getProposalsFx.doneData, (state, data) => data.data.results)
    .on(deleteProposalFx.doneData, (store, id) =>
        id !== null ? store.filter((el) => el.id !== id) : store)
    .on(updateProposalFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex(
            (el) => el.id === data.id
        );
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })


const $proposal = createStore<IProposal | null>(null)
    .on(getProposalFx.doneData, (_, data) => data.data)
    .on(updateProposalFx.doneData, (_, data) => data)


const $proposalForCompanies =  createStore<IProposal | null>(null)
    .on(getProposalForCompaniesFx.doneData, (_, data) => data.data)


sample({
    // @ts-ignore
    clock: [gate.open],
    target: getProposalsFx
})

sample({
    // @ts-ignore
    clock: [proposalGate.open],
    target: getProposalFx
})

sample({
    // @ts-ignore
    clock: [proposalForCompaniesGate.open],
    target: getProposalForCompaniesFx
})

export {
    $proposals,
    $proposal,
    $proposalForCompanies,
    getProposalsFx,
    getProposalFx,
    deleteProposalFx,
    proposalGate,
    gate,
    updateProposalFx,
    getProposalForCompaniesFx,
    proposalForCompaniesGate,
};
