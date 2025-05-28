import { useEvent, useStore } from 'effector-react';
import { Pagination } from './types';

export const usePagination = (pagination: Pagination) => ({
  currentPage: useStore(pagination.$currentPage),
  totalPages: useStore(pagination.$totalPages),
  perPage: useStore(pagination.$perPage),
  loadMore: useEvent(pagination.loadMore),
  setPerPage: useEvent(pagination.setPerPage),
  setFirstPage: useEvent(pagination.setFirstPage)
});
