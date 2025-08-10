import {applicationApi, applicationModel} from '@box/entities/application';
import {recyclableModel} from '@box/entities/recyclable';
import {combine, createEffect, createStore} from 'effector';
import {createList} from '@box/shared/lib/factories';
import {stockGlassFiltersModel} from '@box/features/application';
import Router from "next/router";


type Params = Parameters<typeof applicationApi.getApplications>[0];
const getApplications = (deal_type: 1 | 2) => async (params: Params) => {
    const router = Router
    const {data} = await applicationApi.getApplications({
        ...params,
        deal_type,
        ordering: 'price'
    });
    //@ts-ignore
    const results = data.results.filter(app => +app.urgencyType.id === +router.query.type);
    return {
        result: results,
        count: data.count,
        page: params.page
    }
}

const getPurchaseListFx = createEffect<Params, {
    result: Array<applicationModel.IRecyclableApplication>,
    count: number,
    page?: number
}>({
    handler: getApplications(1)
});


const getSalesListFx = createEffect<Params, {
    result: Array<applicationModel.IRecyclableApplication>,
    count: number,
    page?: number
}>({
    handler: getApplications(2)
});


const purchaseList = createList({
    filters: combine({
        filters: stockGlassFiltersModel.filters.$values,
        currentRecyclable: recyclableModel.$recyclable,
    }),
    mapFilters: ({filters, currentRecyclable}) => ({
        recyclables: [currentRecyclable?.id || 0],
        no_page: !filters.no_page,
        status: 2,
        ...(filters.price__lte.length > 0 && {price__lte: filters.price__lte}),
        ...(filters.price__gte.length > 0 && {price__gte: filters.price__gte}),
        ...(filters.total_weight__gte.length > 0 && {total_weight__gte: +filters.total_weight__gte * 1000}),
        ...(filters.total_weight__lte.length > 0 && {total_weight__lte: +filters.total_weight__lte * 1000}),
        ...(filters.city?.value?.id && {city: filters.city.value.id}),
        ...(filters.region?.value?.id && {city__region: filters.region.value.id}),
        ...(filters.district?.value?.id && {city__region__district: filters.district.value.id}),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__gte: filters.createdAt[0] || undefined}
        ),
        ...(filters.urgency_type && {
            //ТОЛЬКО КОНТРАКТЫ НА ПОСТАВКУ
            urgency_type: filters.urgency_type
        }),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__lte: filters.createdAt[1] || undefined}
        ),
    }),
    effect: getPurchaseListFx
});

const salesList = createList({
    filters: combine({
        filters: stockGlassFiltersModel.filters.$values,
        currentRecyclable: recyclableModel.$recyclable,
    }),
    mapFilters: ({filters, currentRecyclable}) => ({
        recyclables: [currentRecyclable?.id || 0],
        no_page: !filters.no_page,
        status: 2,
        ...(filters.price__lte.length > 0 && {price__lte: filters.price__lte}),
        ...(filters.price__gte.length > 0 && {price__gte: filters.price__gte}),
        ...(filters.total_weight__gte.length > 0 && {total_weight__gte: +filters.total_weight__gte * 1000}),
        ...(filters.total_weight__lte.length > 0 && {total_weight__lte: +filters.total_weight__lte * 1000}),
        // ...(filters.total_weight__gte.length > 0 && {total_weight__gte: (parseInt(filters.total_weight__gte, 10) * 1000)}),
        // ...(filters.total_weight__gte.length > 0 && {total_weight__lte: (parseInt(filters.total_weight__gte, 10) * 1000)}),
        ...(filters.city?.value?.id && {region: filters.city.value.id}),
        ...(filters.region?.value?.id && {city__region: filters.region.value.id}),
        ...(filters.district?.value?.id && {city__region__district: filters.district.value.id}),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__gte: filters.createdAt[0] || undefined}
        ),
        ...(filters.urgency_type && {
            urgency_type: filters.urgency_type
        }),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__lte: filters.createdAt[1] || undefined}
        ),
    }),
    effect: getSalesListFx
});

const $salesStore = createStore<{ result: Array<applicationModel.IRecyclableApplication>, count: number }>({
    result: [],
    count: 0
})
    .on(salesList.effect.doneData, (state, payload) => {
        if (payload.page && payload.page > 1) {

            return {
                result: [...state.result, ...payload.result
                ], count: payload.count
            }
        }
        return {
            result: payload.result,
            count: payload.count
        }
    });


const $purchaseStore = createStore<{
    result: Array<applicationModel.IRecyclableApplication>,
    count: number
}>({result: [], count: 0})
    .on(purchaseList.effect.doneData, (state, payload) => {
        if (payload.page && payload.page > 1) {
            return {
                result: [...state.result, ...payload.result
                ], count: payload.count
            }
        }

        return {
            result: payload.result,
            count: payload.count
        }
    });

const purchase = {
    store: $purchaseStore,
    list: purchaseList
};

const sales = {
    store: $salesStore,
    list: salesList
};

export {
    purchase,
    sales,
};
