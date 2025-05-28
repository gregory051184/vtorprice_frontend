import {createEffect, createStore} from "effector";
import {AxiosError} from "axios";
import {recyclablesForOffersApi} from "@box/entities/generate-list-of-offers/api/RecyclablesForGenerateListOfOffers";
import {ICompany} from "@box/entities/company/model";
import {createLoaderStore} from "@box/shared/lib/helpers";
import {createGate} from "effector-react";


export const changeIdFx = createEffect<number, number>({
    handler: async (params) => {
        return params
    }
})
const $recyclableId = createStore<number>(0).on(changeIdFx.doneData, (state, new_state) => {
    return new_state
})

const gate = createGate();
const getDealForOffersFx = createEffect<
    Parameters<typeof recyclablesForOffersApi.getDealsForOffer>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesForOffersApi.getDealsForOffer>>['data'],
    id?: string,
    page?: number,
    ordering?: string

}, AxiosError>({
    handler: async (params) => {
        if (params.id) {
            const {data} = await recyclablesForOffersApi.getDealsForOffer(params);
            return {
                data,
                page: params.page,
            };
        }
        params['id'] = $recyclableId.getState().toString()
        const {data} = await recyclablesForOffersApi.getDealsForOffer(params);
        return {
            data,
            page: params.page,
        }
    }
});

const companiesOffersLoading = createLoaderStore(false, getDealForOffersFx);

// @ts-ignore
// eslint-disable-next-line
const $dealsForOffers = createStore<Array<ICompany>>([])
    .on(getDealForOffersFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {

            const res = data.data.results.map((item: any) => item.id)
            const st = state.map((item: any) => item.id)
            let difference = res
                .filter(x => !st.includes(x))
            let final = data.data.results.filter((item: any) => difference.includes(item.id))
            for (let i = 0; i < final.length; i++) {
                state.push(final[i])
            }

            if (data.ordering === 'dealsByThisRecyclable') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return a.dealsByRecyclableForOffers - b.dealsByRecyclableForOffers;
                });
                return state
            }
            if (data.ordering === '-dealsByThisRecyclable') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.dealsByRecyclableForOffers - a.dealsByRecyclableForOffers;
                });
                return state
            }

            if (data.ordering === 'lastDealDate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(a.lastDealDate) - new Date(b.lastDealDate);
                });
                return state
            }
            if (data.ordering === '-lastDealDate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(b.lastDealDate) - new Date(a.lastDealDate);
                });
                return state
            }

            if (data.ordering === 'lastAppDate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(a.lastAppDate) - new Date(b.lastAppDate);
                });
                return state
            }
            if (data.ordering === '-lastAppDate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(b.lastAppDate) - new Date(a.lastAppDate);
                });
                return state
            }

            if (data.ordering === 'buyAppsByThisRecyclable') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return a.buyAppsByThisRecyclable - b.buyAppsByThisRecyclable;
                });
                return state
            }
            if (data.ordering === '-buyAppsByThisRecyclable') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.buyAppsByThisRecyclable - a.buyAppsByThisRecyclable;
                });
                return state
            }



            if (data.ordering === 'address') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new a.lastDealDate - b.lastDealDate;
                });
                return state
            }
            if (data.ordering === '-address') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new b.lastDealDate - new a.lastDealDate;
                });
                return state
            }

            if (data.ordering === 'averageReviewRate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new a.averageReviewRate - b.averageReviewRate;
                });
                return state
            }
            if (data.ordering === '-averageReviewRate') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return new b.averageReviewRate - new a.averageReviewRate;
                });
                return state
            }
            return state
        }
        return data.data;
    })

export {
    $recyclableId,
    gate,
    $dealsForOffers,
    getDealForOffersFx,
    companiesOffersLoading
}