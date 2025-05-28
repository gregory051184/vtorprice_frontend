import {createEffect, createStore} from "effector";
import {recyclablesForOffersApi} from "@box/entities/generate-list-of-offers/api/RecyclablesForGenerateListOfOffers";
import {AxiosError} from "axios";
import {IRecyclableApplication} from "@box/entities/application/model";

const getApplicationsForOfferFx = createEffect<
    Parameters<typeof recyclablesForOffersApi.getApplicationsForOffer>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesForOffersApi.getApplicationsForOffer>>['data'],
    page?: number

}, AxiosError>({
    handler: async (params) => {
        const {data} = await recyclablesForOffersApi.getApplicationsForOffer(params);
        return {
            data,
            page: params.page,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $applicationsForOffers = createStore<Array<IRecyclableApplication>>([])
    .on(getApplicationsForOfferFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                //ДОБАВИЛ ФИЛЬТРЫ
                // @ts-ignore
                ...data.data.results
            ];
        }
        return data.data.results
    })

export {
    $applicationsForOffers,
    getApplicationsForOfferFx
}