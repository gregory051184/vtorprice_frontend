import {
  createEvent, createStore, sample, Event, Effect
} from 'effector';
import { Paginationable } from '@types';
import { Pagination } from './types';

export const createPagination = (
  paginationableEffect: Effect<any, {
    [key: string]: any,
    data: {
      results: any
    } & Paginationable
  }, any>,
  resetEvent?:Event<unknown>
): Pagination => {
  const loadMore = createEvent();
  const setTotalPages = createEvent<number>();
  const $totalPages = createStore<number>(0)
    .on(setTotalPages, (_, data) => data);
  const setPerPage = createEvent<number>();
  const $perPage = createStore<number>(7)
    .on(setPerPage, (_, data) => data);

  const loadMoreEv = sample({
    clock: loadMore,
    source: $totalPages
  });
  const setCurrentPage = createEvent<number>();
  const setFirstPage = createEvent();
  const $currentPage = createStore<number>(1)
    .on(loadMoreEv, (state, total) => {
      const nextPage = state + 1;
      if (nextPage <= total) {
        return nextPage;
      }
      return state;
    })
    .on(setCurrentPage, (_, data) => data)
    .on(setFirstPage, (_, data) => 1);

  sample({
    clock: paginationableEffect?.doneData,
    fn: (source) => source.data?.pageCount || source.pageCount,
    target: setTotalPages
  });

  if (resetEvent) {
    sample({
      clock: resetEvent,
      target: [
        setCurrentPage.prepend(() => 1),
        setTotalPages.prepend(() => 0)
      ]
    });
  }

  return {
    $currentPage,
    $totalPages,
    $perPage,
    loadMore,
    setPerPage,
    setTotalPages,
    setCurrentPage,
    setFirstPage
  };
};
