import {
  attach, combine, Effect,
  EffectParams, merge, sample, Store, Unit
} from 'effector';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { createGate } from 'effector-react';

export const createList = <
  T extends Effect<any, any, any>,
  FiltersType extends Store<any>
> (config: {
  effect: T,
  filters: FiltersType,
  mapFilters: (filters: FiltersType extends Store<infer U> ? U : FiltersType)=> Omit<EffectParams<T>, 'page' | 'ordering'>,
  fetchFilter?: Store<boolean>
}) => {
  const gate = createGate();
  const pagination = createPagination(
    config.effect,
    merge(
      [gate.close, config.filters]
    )
  );
  const ordering = createOrdering();

  let filter;
  if (config.fetchFilter) {
    filter = config.fetchFilter;
  } else {
    filter = () => true;
  }

  const listEffect = attach({
    source: combine({
      ordering: ordering?.$ordering,
      currentPage: pagination.$currentPage,
      size: pagination.$perPage,
      filters: config.filters
    }),
    effect: config.effect,
    // @ts-ignore
    mapParams: (_, {
      ordering, currentPage, size, filters
    }) => {
      const mappedFilters = config.mapFilters(filters);
      return {
        ordering,
        size,
        page: currentPage,
        ...mappedFilters
      };
    }
  });

  sample({
    clock: [pagination.loadMore, config.filters as Unit<any>, 
      gate.open, ordering.$ordering, pagination.setPerPage],
    filter: filter as any,
    target: listEffect
  });

  return {
    effect: listEffect,
    pagination,
    gate,
    ordering
  };
};
