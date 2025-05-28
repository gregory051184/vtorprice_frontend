import { createGate } from 'effector-react';
import {
  sample, attach, merge
} from 'effector';
import { createPagination } from '@box/shared/lib/factories';
import { recycablesPricesModel } from '@box/entities/statistics';
import { recycablePricesFilterModel } from '@box/features/statistics/filters/recycablePricesFilter';

const gate = createGate();

const pagination = createPagination(
    recycablesPricesModel.getRecycablesPricesFx,
    merge(
      [gate.close, recycablePricesFilterModel.filters.$values]
    )
);

const getRecycablesPricesFx = attach({
  source: {
    filters: recycablePricesFilterModel.filters.$values,
    page: pagination.$currentPage,
  },
  mapParams: (_, { filters, page }) => {

    return {
      category: filters.category?.value.id?.toString(),
      category__parent: filters.category__parent?.value.id?.toString(),
      applications__city: filters.applications__city?.value.id?.toString(),
      applications__urgency_type: filters.applications__urgency_type?.value,
      page,
      period: filters.period?.value,
    };
  },
  effect: recycablesPricesModel.getRecycablesPricesFx,
});

  sample({
    clock: [
      gate.open,
      recycablePricesFilterModel.filters.$values,
      pagination.loadMore
    ],
    source: recycablePricesFilterModel.filters.$values,
    target: getRecycablesPricesFx
  });
  
  export {
    getRecycablesPricesFx,
    gate,
    pagination
  };