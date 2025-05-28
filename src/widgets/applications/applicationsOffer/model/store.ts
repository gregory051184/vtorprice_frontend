import {createGate} from "effector-react";
import {createPagination} from "@box/shared/lib/factories";
import {attach, merge, sample} from "effector";

import { applicationsForOffersFiltersModel } from "@box/features/application";
import { applicationsForOffersModel } from "@box/entities/app-offer";

const gate = createGate();

const pagination = createPagination(
    applicationsForOffersModel.getApplicationsForOfferFx,
    merge(
        [gate.close, applicationsForOffersFiltersModel.applicationsForOffersFilters.$values]
    )
);

const getApplicationsForOfferFx = attach({
    source: {
        filters: applicationsForOffersFiltersModel.applicationsForOffersFilters.$values,
        page: pagination.$currentPage,
    },
    //@ts-ignore
    mapParams: (_, { filters, page }) => {

        return {
            category: filters.category?.value.id?.toString(),
            page,
            period: filters.period?.value,
        };
    },
    effect: applicationsForOffersModel.getApplicationsForOfferFx,
});

sample({
    clock: [
        gate.open,
        applicationsForOffersFiltersModel.applicationsForOffersFilters.$values,
        pagination.loadMore
    ],
    source: applicationsForOffersFiltersModel.applicationsForOffersFilters.$values,
    target: getApplicationsForOfferFx
});

export {
    getApplicationsForOfferFx,
    gate,
    pagination
};