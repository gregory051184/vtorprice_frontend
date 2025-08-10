import {createEffect, createStore, merge, sample} from 'effector';
import {dealModel, dealApi} from '@box/entities/deal';
import {createOrdering, createPagination} from '@box/shared/lib/factories';
import {usersDealsFiltersModel} from '@box/features/deal';
import {equipmentDealsApi} from "@box/entities/application/api/equipmentDealsApi";
import {createLoaderStore} from "@box/shared/lib/helpers";
import {createGate} from "effector-react";
import {attach} from "effector/compat";
import {getApplicationsFx} from "@box/entities/application/model";

const gate = createGate();
const ordering = createOrdering();

const getDealsFx = createEffect<any, any, any>({
    handler: async (params) => {
        const {data} = await dealApi.list(params);
        return {
            data,
            page: params.page,
            count: data.results.length
        };
    }
});

const equipmentGate = createGate();
const equipmentOrdering = createOrdering();

const getEquipmentDealsFx = createEffect<any, any, any>({
    handler: async (params) => {
        const {data} = await equipmentDealsApi.list(params);
        return {
            data,
            page: params.page,
            count: data.results.length
        };
    }
});

const dealsLoading = createLoaderStore(false, getDealsFx);
const pagination = createPagination(getDealsFx, merge([
    gate.close,
    usersDealsFiltersModel.filters.$values
]))

const getDeals = attach({
    source: {
        filters: usersDealsFiltersModel.filters.$values,
        page: pagination.$currentPage,
        ordering: ordering.$ordering,
        size: pagination.$perPage
    },
    mapParams: (_, {
        filters, page, size
    }) => ({
        page,
        size,
        ordering: '-created_at',
        search: filters.search,
        is_my: true,
        ...(filters.status && {status: filters.status?.value}),
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status && {status: +filters.status.value}),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__gte: filters.createdAt[0] || undefined}
        ),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__lte: filters.createdAt[1] || undefined}
        ),
        ...(filters.application__recyclables__category
            && {application__recyclables__category: filters.application__recyclables__category.value.id})
    }),
    effect: getDealsFx
})

const equipmentDealsLoading = createLoaderStore(false, getEquipmentDealsFx);

const equipmentPagination = createPagination(getEquipmentDealsFx, merge([
    gate.close,
    usersDealsFiltersModel.equipmentFilters.$values
]))

const getEquipmentDeals = attach({
    source: {
        filters: usersDealsFiltersModel.equipmentFilters.$values,
        page: equipmentPagination.$currentPage,
        ordering: equipmentOrdering.$ordering,
        size: equipmentPagination.$perPage
    },
    mapParams: (_, {
        filters, page, size
    }) => ({
        page,
        size,
        ordering: '-created_at',
        search: filters.search,
        is_my: true,
        ...(filters.status && {status: filters.status?.value}),
        ...(filters.price__lte && {price__lte: +filters.price__lte}),
        ...(filters.price__gte && {price__gte: +filters.price__gte}),
        ...(filters.status && {status: +filters.status.value}),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__gte: filters.createdAt[0] || undefined}
        ),
        ...(filters.createdAt.every((el) => el !== null)
            && {created_at__lte: filters.createdAt[1] || undefined}
        ),
        ...(filters.application__equipment__category
            && {application__equipment__category: filters.application__equipment__category.value.id})
    }),
    effect: getEquipmentDealsFx
})

const $applicationsDealsNumber = createStore<number>(0)
    .on(
        getDealsFx.doneData, (_, data) => {
            return data.data.count
        }
    )

const $equipmentDealsNumber = createStore<number>(0)
    .on(
        getEquipmentDealsFx.doneData, (_, data) => {
            return data.data.count
        }
    )

const $deals = createStore<Array<dealModel.IDeal>>([])
    .on(getEquipmentDealsFx.doneData, (state, payload) => {
        if (payload.page && payload.page > 1) {
            return [
                ...state,
                ...payload.data.results,
            ];
        }
        return payload.data.results;
    })
    .on(getDealsFx.doneData, (state, payload) => {
        if (payload.page && payload.page > 1) {
            return [
                ...state,
                ...payload.data.results,
            ];
        }
        return payload.data.results;
    });

const searchDealFieldValue = usersDealsFiltersModel.filters.fields.search.$value;
const resetDealForm = usersDealsFiltersModel.filters.reset;

sample({
    clock: [
        gate.open,
        pagination.loadMore,
        pagination.setPerPage,
        searchDealFieldValue,
        usersDealsFiltersModel.applyUsersApplicationTableFilters,
        resetDealForm
    ],
    target: getDeals
})

const searchEquipmentDealFieldValue = usersDealsFiltersModel.equipmentFilters.fields.search.$value;
const resetEquipmentDealForm = usersDealsFiltersModel.equipmentFilters.reset;

sample({
    clock: [
        equipmentGate.open,
        equipmentPagination.loadMore, equipmentPagination.setPerPage,
        searchEquipmentDealFieldValue,
        usersDealsFiltersModel.applyUsersEquipmentApplicationTableFilters,
        resetEquipmentDealForm
    ],
    target: getEquipmentDeals
})


export {
    getDealsFx,
    $deals,
    gate,
    pagination,
    getEquipmentDealsFx,
    equipmentGate,
    equipmentPagination,
    dealsLoading,
    equipmentDealsLoading,
    $applicationsDealsNumber,
    $equipmentDealsNumber

};
