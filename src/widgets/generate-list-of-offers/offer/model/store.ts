import {createGate} from "effector-react";
import {createPagination} from "@box/shared/lib/factories";
import {attach, merge, sample} from "effector";
import { dealsForOffersModel } from "@box/entities/generate-list-of-offers";
import { dealsForOffersFiltersModel } from "@box/features/generateListOfOffers";

const gate = createGate();

const pagination = createPagination(
    dealsForOffersModel.getDealForOffersFx,
    merge(
        [gate.close, dealsForOffersFiltersModel.dealsForOffersFilters.$values]
    )
);

const getDealForOffersFx = attach({
    source: {
        filters: dealsForOffersFiltersModel.dealsForOffersFilters.$values,
        page: pagination.$currentPage,
    },
    //@ts-ignore
    mapParams: (_, { filters, page }) => {

        return {
            dealsByThisRecyclable: filters.dealsByThisRecyclable?.value,
            lastDealDate: filters.lastDealDate?.value,
            city: filters.city?.value.id,
            page
        };
    },
    effect: dealsForOffersModel.getDealForOffersFx,
});

sample({
    clock: [
        gate.open,
        dealsForOffersFiltersModel.dealsForOffersFilters.$values,
        pagination.loadMore
    ],
    source: dealsForOffersFiltersModel.dealsForOffersFilters.$values,
    target: getDealForOffersFx
});

export {
    getDealForOffersFx,
    gate,
    pagination
};