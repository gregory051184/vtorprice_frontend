import { Pagination } from '@box/shared/lib/factories';

export interface IPagination {
  pagination: Pagination;
  hasUpdate?: boolean;
  withoutPositionsPerPage?: boolean;
}
