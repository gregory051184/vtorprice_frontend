import {createGate} from "effector-react";
import {attach, createEffect, createStore, merge, sample} from "effector";
import {AxiosError} from "axios";
import {dealApi} from "@box/entities/deal";
import {IDeal} from "@box/entities/deal/model";
import {managersFilters} from "@box/entities/user/filters";
import {createOrdering, createPagination} from "@box/shared/lib/factories";
import {createLoaderStore} from "@box/shared/lib/helpers";



const gate = createGate();
const ordering = createOrdering();

const getManagerDealsFx = createEffect<
    Parameters<typeof dealApi.getManagerDeals>[0],
    {
        data: Awaited<ReturnType<typeof dealApi.getManagerDeals>>["data"];
        page?: number
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await dealApi.getManagerDeals(params);

        return {
            data,
            page: params.page,
            count: data.count
        };
    },
});

const pagination = createPagination(
    getManagerDealsFx,
    merge([gate.close, managersFilters.$values])
);

const getManagerDealsFilteredFx = attach({
    source: {
        filters: managersFilters.$values,
        ordering: ordering.$ordering,
        page: pagination.$currentPage,
    },
    mapParams: (_, {filters, page, ordering}) => ({
        page,
        search: filters.search,
        status: filters.status?.value as number,
        ordering: ordering || '',
        created_by: filters?.manager?.value?.id,
        application__recyclables: filters?.application__recyclables?.value?.id,
        ...(filters.created_at[0] && {created_at__gte: filters.created_at[0].toJSON().split('T')[0]}),
        ...(filters.created_at[1] && {created_at__lte: filters.created_at[1].toJSON().split('T')[0]}),
    }),
    effect: getManagerDealsFx
})

const managerDealsLoading = createLoaderStore(false, getManagerDealsFx);

const $managerDeals = createStore<Array<IDeal>>([])
    .on(getManagerDealsFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                ...data.data.results,
            ];
        }
        return data.data.results;
    })

const $dealsNumber = createStore<number>(0)
    .on(
        getManagerDealsFx.doneData, (_, data) => {
            return data.data.count
        }
    )

sample({
    //@ts-ignore
    clock: [
        gate.open,
        managersFilters.$values,
        pagination.loadMore,
        ordering.$ordering
    ],
    source: managersFilters.$values,
    target: getManagerDealsFilteredFx
})

export {
    gate,
    ordering,
    $managerDeals,
    pagination,
    managerDealsLoading,
    $dealsNumber
}