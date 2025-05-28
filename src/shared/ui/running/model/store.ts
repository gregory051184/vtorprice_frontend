import {createEffect, createStore} from "effector";
import {applicationApi} from "@box/entities/application";
import {AxiosError} from "axios";
import {IRecyclableApplication} from "@box/entities/application/model";
import {createGate} from "effector-react";
import {createLoaderStore} from "@box/shared/lib/helpers";


const gate = createGate();

const getAllCompanyApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getAllCompanyApplications>[0],
    {
        data: Awaited<ReturnType<typeof applicationApi.getAllCompanyApplications>>["data"];
        page?: number;
        company?: number;
    },
    AxiosError
>({
    handler: async (params) => {
        const { data } = await applicationApi.getAllCompanyApplications(params);
        return {
            data,
            page: params.page,
        };
    },
});

const getAllCompanyApplicationsLoading = createLoaderStore(false, getAllCompanyApplicationsFx);


const $allCompanyApplications = createStore<Array<IRecyclableApplication>>([])
    .on(getAllCompanyApplicationsFx.doneData, (state, data) => {
        return data.data.results;
    })

export {
    getAllCompanyApplicationsLoading,
    getAllCompanyApplicationsFx,
    $allCompanyApplications,
    gate
}