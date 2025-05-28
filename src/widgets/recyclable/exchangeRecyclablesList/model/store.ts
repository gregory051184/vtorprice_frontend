import {
  attach, merge, sample
} from 'effector';
import { exchangeRecyclableModel } from '@box/entities/exchangeRecyclable';
import { createGate } from 'effector-react';
import { exchangeRecyclablesListFiltersModel } from '@box/features/recyclable';
import { createOrdering, createPagination } from '@box/shared/lib/factories';

const gate = createGate();

const ordering = createOrdering();
const pagination = createPagination(
  exchangeRecyclableModel.getExchangeRecyclablesFx,
  merge(
    [gate.close, exchangeRecyclablesListFiltersModel.filters.$values]
  )
);

const getExchangeRecyclablesFx = attach({
  source: {
    filters: exchangeRecyclablesListFiltersModel.filters.$values,
    ordering: ordering.$ordering,
    page: pagination.$currentPage,
    size: pagination.$perPage
  },
  mapParams: (_, { filters, page, size, ordering }) => ({
    category: filters.category?.value.id,
    urgency_type: filters.urgency_type?.value,
    search: filters.search,
    ordering: ordering || '',
    page,
    size,
  }),
  effect: exchangeRecyclableModel.getExchangeRecyclablesFx
});

sample({
  clock: [
    gate.open,
    exchangeRecyclablesListFiltersModel.filters.$values,
    ordering.$ordering,
    pagination.loadMore,
    pagination.setFirstPage,
    pagination.$currentPage
  ],
  target: getExchangeRecyclablesFx
});

export {
  pagination,
  ordering,
  gate
};
