import {createEffect, createStore, sample} from "effector";
import {applicationApi} from "@box/entities/application";
import {AxiosError} from "axios";
import {IRecyclableApplication} from "@box/entities/application/model";
import {createGate} from "effector-react";
import {createLoaderStore} from "@box/shared/lib/helpers";
import Router from "next/router";


const gate = createGate();

const getAllCompanyApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getAllCompanyApplications>[0],
    {
        data: Awaited<ReturnType<typeof applicationApi.getAllCompanyApplications>>["data"];
    },
    AxiosError
>({
    handler: async (params) => {
        params["company"] = +Router.asPath.split('/')[Router.asPath.split('/').length - 1]
        const { data } = await applicationApi.getAllCompanyApplications(params);
        return {
            data
        };
    },
});

const getAllCompanyApplicationsLoading = createLoaderStore(false, getAllCompanyApplicationsFx);


const $allCompanyApplications = createStore<Array<IRecyclableApplication>>([])
    .on(getAllCompanyApplicationsFx.doneData, (state, data) => data.data)

sample({
    //@ts-ignore
    clock: gate.open,
    target: getAllCompanyApplicationsFx
})

export {
    getAllCompanyApplicationsLoading,
    getAllCompanyApplicationsFx,
    $allCompanyApplications,
    gate
}