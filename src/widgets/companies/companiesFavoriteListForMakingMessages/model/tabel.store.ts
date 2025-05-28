import { companyApi, companyModel } from '@box/entities/company';
import { companiesFavoritesFilter } from '@box/features/company/filters/copmaniesFavorites';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { AxiosError } from 'axios';
import { createGate } from 'effector-react';
import {
    attach,
    createEffect,
    createEvent,
    createStore,
    merge,
    sample,
} from 'effector';
import { ICompany } from '@box/entities/company/model';
import { createLoaderStore } from '@box/shared/lib/helpers';

const gate = createGate();
const ordering = createOrdering();
const requestEv = createEvent();

const getCompaniesFx = createEffect<
    Parameters<typeof companyApi.getCompanies>[0],
    {
        data: Awaited<ReturnType<typeof companyApi.getCompanies>>['data'];
        page?: number;
    },
    AxiosError
>({
    handler: async (params) => {
        const { data } = await companyApi.getCompanies(params);

        return {
            data,
            page: params.page,
        };
    },
});

const favoriteCompaniesLoading = createLoaderStore(false, getCompaniesFx);

const updateCompanyInFavoriteFx = createEffect<
    Parameters<typeof companyApi.updataCompanyInFavorite>[0], ICompany, AxiosError>({
    handler: async (params) => {
        const { data } = await companyApi.updataCompanyInFavorite(params);
        return data;
    }
});

const pagination = createPagination(getCompaniesFx, merge([
    gate.close,
    companiesFavoritesFilter.filters.$values
]));

const getFavoritesCompaniesFx = attach({
    source: {
        filters: companiesFavoritesFilter.filters.$values,
        page: pagination.$currentPage,
        ordering: ordering.$ordering,
        size: pagination.$perPage
    },
    mapParams: (_, {
        filters, page, ordering, size
    }) => ({
        page,
        size,
        ordering,
        is_favorite: true,
        search: filters.search,
        recyclables__recyclables: filters.recyclables?.value.id.toString(),
        activity_types__rec_col_types: filters.activity_types__rec_col_types?.value.id.toString(),
        city: filters.company__city?.value.id,
        ...(filters.createdAt[0] && { created_at__gte: filters.createdAt[0] }),
        ...(filters.createdAt[1] && { created_at__gte: filters.createdAt[1] }),
    }),
    effect: getCompaniesFx,
});

const $favoritesCompaniesList = createStore<companyModel.ICompany[]>([])
    .on(
        getCompaniesFx.doneData,
        (store, payload) => {
            if (payload.page && payload.page > 1) {
                return [...store, ...payload.data.results];
            }
            return [...payload.data.results];
        }

    )
    .on(updateCompanyInFavoriteFx.doneData, (store, data) => {
        const newStore = [...store];
        const uppdateCopmanyIndex = newStore.findIndex((el) => el.id === data.id);
        if(uppdateCopmanyIndex != null) {
            newStore[uppdateCopmanyIndex].isFavorite = data.isFavorite;
        }
        return newStore;
    });

const searchFieldValue = companiesFavoritesFilter.filters.fields.search.$value;
const resetForm = companiesFavoritesFilter.filters.reset;

sample({
    clock: [requestEv, gate.open, pagination.loadMore, searchFieldValue,
        companiesFavoritesFilter.applyFavoritesFilters,
        resetForm, ordering.setOrdering, pagination.setPerPage],
    target: getFavoritesCompaniesFx,
});

export {
    $favoritesCompaniesList, updateCompanyInFavoriteFx, requestEv,
    gate, ordering, pagination, favoriteCompaniesLoading
};
