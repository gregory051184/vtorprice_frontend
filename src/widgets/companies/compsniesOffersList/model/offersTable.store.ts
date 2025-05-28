import { createGate } from 'effector-react';
import {
    sample, attach, merge
} from 'effector';
import {
    companiesListFiltersModel,
} from '@box/features/company';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { dealsForOffersModel } from '@box/entities/generate-list-of-offers';

const gate = createGate();
const ordering = createOrdering();

const pagination = createPagination(dealsForOffersModel.getDealForOffersFx, merge([
    gate.close,
    companiesListFiltersModel.filters.$values
]));

const getCompaniesFx = attach({
    source: {
        filters: companiesListFiltersModel.filters.$values,
        ordering: ordering.$ordering,
        page: pagination.$currentPage
    },
    mapParams: (_, { filters, page, ordering }) => {
        const mappedAdvantages = filters.activity_types__advantages?.map((el) => el.value.id);

        return {
            page,
            activity_types__rec_col_types: filters.activity_types__rec_col_types?.value.id.toString(),
            recyclables__recyclables: filters.recyclables__recyclables?.value.id.toString(),
            status: filters.status?.value as number,
            city: filters.city?.value.id,
            activity_types__advantages: mappedAdvantages,
            search: filters.search,
            ordering: ordering || ''
        };
    },
    effect: dealsForOffersModel.getDealForOffersFx
});

sample({
    clock: [
        gate.open,
        companiesListFiltersModel.filters.$values,
        pagination.loadMore,
        ordering.$ordering
    ],
    source: companiesListFiltersModel.filters.$values,
    target: getCompaniesFx
});

export {
    getCompaniesFx,
    gate,
    ordering,
    pagination
};
