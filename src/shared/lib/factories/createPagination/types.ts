import { Store, Event } from 'effector';

export type Pagination = {
  $currentPage: Store<number>,
  $totalPages: Store<number>,
  $perPage: Store<number>,
  loadMore: Event<void>,
  setPerPage: Event<number>,
  setCurrentPage: Event<number>,
  setTotalPages: Event<number>,
  setFirstPage: Event<void>
};
