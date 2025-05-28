import { createGate } from 'effector-react';
import {
  sample, attach, merge
} from 'effector';
import { createPagination } from '@box/shared/lib/factories';
import { recyclableForGenerateListOfOffersFiltersModel } from '@box/features/generateListOfOffers';
import { recyclableForGenerateListOfOffersModel } from '@box/entities/generate-list-of-offers';

const gate = createGate();

const pagination = createPagination(
    recyclableForGenerateListOfOffersModel.getRecyclablesForGeneratingListOfOffersFx,
    merge(
      [gate.close, recyclableForGenerateListOfOffersFiltersModel.generateListOfOffersfilters.$values]
    )
);

const getRecyclablesForGenerateListOfOffersFx = attach({
  source: {
    filters: recyclableForGenerateListOfOffersFiltersModel.generateListOfOffersfilters.$values,
    page: pagination.$currentPage,
  },
  mapParams: (_, { filters, page }) => {

    return {
      category: filters.category?.value.id?.toString(),
      page,
      period: filters.period?.value,
    };
  },
  effect: recyclableForGenerateListOfOffersModel.getRecyclablesForGeneratingListOfOffersFx,
});

  sample({
    clock: [
      gate.open,
      recyclableForGenerateListOfOffersFiltersModel.generateListOfOffersfilters.$values,
      pagination.loadMore
    ],
    source: recyclableForGenerateListOfOffersFiltersModel.generateListOfOffersfilters.$values,
    target: getRecyclablesForGenerateListOfOffersFx
  });
  
  export {
    getRecyclablesForGenerateListOfOffersFx,
    gate,
    pagination
  };