import {createEffect, createStore} from 'effector';
import {AxiosError} from 'axios';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {IExchangeRecyclable} from './types';
import {exchangeRecyclableApi} from '../api';

const getExchangeRecyclablesFx = createEffect<
    Parameters<typeof exchangeRecyclableApi.getExchangeRecyclables>[0],
    {
        data: Awaited<ReturnType<typeof exchangeRecyclableApi.getExchangeRecyclables>>['data'],
        ordering?: string,
        page?: number,
        //ДОБАВИЛ
        urgency_type?: number
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await exchangeRecyclableApi.getExchangeRecyclables(params);
        return {
            data,
            ordering: params.ordering,
            page: params.page,
            //ДОБАВИЛ
            urgency_type: params.urgency_type,
        };
    }
});

const exchangeRecyclablesLoading = createLoaderStore(false, getExchangeRecyclablesFx);

const $exchangeRecyclables = createStore<Array<IExchangeRecyclable>>([])
    .on(getExchangeRecyclablesFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {

            const res = data.data.results.map((item: any) => item.id)
            const st = state.map((item: any) => item.id)
            let difference = res
                .filter(x => !st.includes(x))
            let final = data.data.results.filter((item: any) => difference.includes(item.id))
            for (let i = 0; i < final.length; i++) {
                state.push(final[i])
            }


            if (data.ordering === 'category') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return a.category - b.category;
                });
                return state
            }
            if (data.ordering === '-category') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.category - a.category;
                });
                return state
            }

            if (data.ordering === 'purchaseApplicationsCount') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return a.purchaseApplicationsCount - b.purchaseApplicationsCount;
                });
                return state
            }
            if (data.ordering === '-purchaseApplicationsCount') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.purchaseApplicationsCount - a.purchaseApplicationsCount;
                });
                return state
            }

            if (data.ordering === 'salesApplicationsCount') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return a.salesApplicationsCount  - b.salesApplicationsCount ;
                });
                return state
            }
            if (data.ordering === '-salesApplicationsCount') {
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.salesApplicationsCount - a.salesApplicationsCount ;
                });
                return state
            }

            if (data.ordering === 'price') {
                const correct_state = state.map((item: any) => {
                    if (!item.latestDealPrice) {
                        item.latestDealPrice = 0;
                    }
                    return item
                })
                correct_state.sort(function (a, b) {
                    //@ts-ignore
                    return a.latestDealPrice - b.latestDealPrice;
                });
                return correct_state
            }
            if (data.ordering === '-price') {
                const correct_state = state.map((item: any) => {
                    if (!item.latestDealPrice) {
                        item.latestDealPrice = 0;
                    }
                    return item
                })
                correct_state.sort(function (a, b) {
                    //@ts-ignore
                    return b.latestDealPrice - a.latestDealPrice;
                });
                return correct_state
            }

            if (data.ordering === 'publishedDate') {
                const correct_state = state.map((item: any) => {
                    if (!item.publishedDate) {
                        item.publishedDate = 0;
                    }
                    return item
                })
                correct_state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(a.publishedDate) - new Date(b.publishedDate);
                });
                return correct_state
            }

            if (data.ordering === '-publishedDate') {
                const correct_state = state.map((item: any) => {
                    if (!item.publishedDate) {
                        item.publishedDate = 0;
                    }
                    return item
                })
                correct_state.sort(function (a, b) {
                    //@ts-ignore
                    return new Date(b.publishedDate) - new Date(a.publishedDate);
                });
                return correct_state
            }

            if (data.ordering === 'lotSize') {
                const correct_state = state.map((item: any) => {
                    if (!item.lotSize) {
                        item.lotSize = 0;
                    }
                    return item
                })
                correct_state.sort(function (a, b) {
                    //@ts-ignore
                    return a.lotSize - b.lotSize;
                });
                return correct_state
            }
            if (data.ordering === '-lotSize') {
                const correct_state = state.map((item: any) => {
                    if (!item.lotSize) {
                        item.lotSize = 0;
                    }
                    return item
                })
                state.sort(function (a, b) {
                    //@ts-ignore
                    return b.lotSize - a.lotSize;
                });
                return state
            }
            return state
        }
        return data.data.results
    });

export {
    getExchangeRecyclablesFx,
    $exchangeRecyclables,
    exchangeRecyclablesLoading
};
