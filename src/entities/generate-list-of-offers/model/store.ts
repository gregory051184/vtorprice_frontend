import {createEffect, createStore} from "effector";
import {AxiosError} from 'axios/index';
import {IGenerateListOfOffers} from "./types";
import {recyclablesForOffersApi} from "@box/entities/generate-list-of-offers/api/RecyclablesForGenerateListOfOffers";
import {createLoaderStore} from "@box/shared/lib/helpers";


const getRecyclablesForGeneratingListOfOffersFx = createEffect<
    Parameters<typeof recyclablesForOffersApi.getCompaniesVerifications>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesForOffersApi.getCompaniesVerifications>>['data'],
    page?: number,

}, AxiosError>({
    handler: async (params) => {
        const {data} = await recyclablesForOffersApi.getCompaniesVerifications(params);
        return {
            data,
            page: params.page,
        };
    }
});

const recycablesOffersLoading = createLoaderStore(false, getRecyclablesForGeneratingListOfOffersFx);

// @ts-ignore
// eslint-disable-next-line
const $generateListOfOffers = createStore<Array<IGenerateListOfOffers>>([])
    .on(getRecyclablesForGeneratingListOfOffersFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                // @ts-ignore
                ...data.data,
            ];
        }
        return data.data;
    })

export {
    $generateListOfOffers,
    getRecyclablesForGeneratingListOfOffersFx,
    recycablesOffersLoading
};